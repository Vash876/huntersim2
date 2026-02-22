/**
 * Friends Store (Pinia)
 * Manages friend list, friend requests, shared tracks and caching.
 * Read-optimized: caches data in sessionStorage, only refreshes on explicit user action.
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useStorage } from '@vueuse/core';
import {
  ensureUserProfile,
  findUserByFriendCode,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriendship,
  getFriendships,
  getUserProfiles,
  clearProfileCache,
  shareTrackToCloud,
  unshareTrack,
  getSharedTracksByUser,
  getFriendsSharedTracks
} from '@/services/friendsService';

// --- Session Cache Helpers ---
const CACHE_KEY = 'cifi-friends-cache';

function saveToCache(data) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      ...data,
      cachedAt: Date.now()
    }));
  } catch (e) { /* sessionStorage full or unavailable */ }
}

function loadFromCache() {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) { return null; }
}

function clearCache() {
  try { sessionStorage.removeItem(CACHE_KEY); } catch (e) {}
}

// Clear friends cache on every page load (F5) so data is always fresh from Firestore.
// The cache only helps during SPA navigation within the same page load.
clearCache();

export const useFriendsStore = defineStore('friends', () => {
  // ---- State ----
  const myProfile = ref(null);
  const friends = ref([]);            // accepted friends with profiles
  const pendingIncoming = ref([]);    // friend requests I received
  const pendingSent = ref([]);        // friend requests I sent
  const friendsTracks = ref([]);      // shared tracks from friends
  const mySharedTrackIds = ref(new Set()); // track IDs I've shared
  const isLoading = ref(false);
  const isInitialized = ref(false);
  const lastRefresh = ref(null);
  const error = ref(null);

  // Persisted hidden friend track IDs (included in backups)
  const hiddenFriendTrackIds = useStorage('cifi-hidden-friend-tracks', []);

  // ---- Computed ----
  const friendCode = computed(() => myProfile.value?.friendCode || '');
  const friendCount = computed(() => friends.value.length);
  const pendingCount = computed(() => pendingIncoming.value.length);
  const hasPending = computed(() => pendingIncoming.value.length > 0);

  // ---- Init ----

  /**
   * Initialize the friends system for a logged-in user.
   * Creates/updates user profile and loads friend list.
   */
  async function init(user) {
    if (!user || !user.uid) {
      reset();
      return;
    }

    // Don't re-init if already loaded for this user
    if (isInitialized.value && myProfile.value?.uid === user.uid) return;

    isLoading.value = true;
    error.value = null;

    try {
      // Try loading from session cache first (avoids Firestore reads on page nav)
      const cached = loadFromCache();
      if (cached && cached.uid === user.uid) {
        myProfile.value = cached.myProfile;
        friends.value = cached.friends || [];
        pendingIncoming.value = cached.pendingIncoming || [];
        pendingSent.value = cached.pendingSent || [];
        mySharedTrackIds.value = new Set(cached.mySharedTrackIds || []);
        friendsTracks.value = cached.friendsTracks || [];
        isInitialized.value = true;
        lastRefresh.value = cached.cachedAt;
        return;
      }

      // No cache — fetch from Firestore (first load or new session)
      myProfile.value = await ensureUserProfile(
        user.uid,
        user.displayName || user.name,
        user.photoURL,
        user.email || user.primaryEmail
      );

      await refreshFriends(user.uid);

      isInitialized.value = true;
      lastRefresh.value = Date.now();
      _saveStateToCache();
    } catch (err) {
      console.error('Friends store init failed:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  /** Reset state on sign-out */
  function reset() {
    myProfile.value = null;
    friends.value = [];
    pendingIncoming.value = [];
    pendingSent.value = [];
    friendsTracks.value = [];
    mySharedTrackIds.value = new Set();
    isInitialized.value = false;
    lastRefresh.value = null;
    error.value = null;
    clearProfileCache();
    clearCache();
  }

  /** Save current state to session cache */
  function _saveStateToCache() {
    if (!myProfile.value) return;
    saveToCache({
      uid: myProfile.value.uid,
      myProfile: myProfile.value,
      friends: friends.value,
      pendingIncoming: pendingIncoming.value,
      pendingSent: pendingSent.value,
      mySharedTrackIds: [...mySharedTrackIds.value],
      friendsTracks: friendsTracks.value
    });
  }

  // ---- Friend List ----

  /** Refresh friend list + profiles from Firestore */
  async function refreshFriends(uid) {
    const myUid = uid || myProfile.value?.uid;
    if (!myUid) return;

    const data = await getFriendships(myUid);

    // Collect all uids we need profiles for
    const allUids = [
      ...data.friends.map(f => f.uid),
      ...data.pendingIncoming.map(f => f.uid),
      ...data.pendingSent.map(f => f.uid)
    ];

    // Batch fetch profiles
    const profiles = allUids.length > 0 ? await getUserProfiles(allUids) : {};

    // Enrich with profile data
    const enrich = (list) => list.map(item => ({
      ...item,
      profile: profiles[item.uid] || { displayName: 'Unknown', friendCode: '???' }
    }));

    friends.value = enrich(data.friends);
    pendingIncoming.value = enrich(data.pendingIncoming);
    pendingSent.value = enrich(data.pendingSent);
    lastRefresh.value = Date.now();
    _saveStateToCache();
  }

  /** Add a friend by their friend code */
  async function addFriendByCode(code) {
    if (!myProfile.value) throw new Error('Not signed in');

    const target = await findUserByFriendCode(code);
    if (!target) throw new Error('Friend code not found');
    if (target.uid === myProfile.value.uid) throw new Error('That\'s your own code!');

    const result = await sendFriendRequest(myProfile.value.uid, target.uid);

    // Refresh list to show updated state
    await refreshFriends();

    return { ...result, targetName: target.displayName };
  }

  /** Accept a pending incoming request */
  async function acceptRequest(otherUid) {
    if (!myProfile.value) throw new Error('Not signed in');
    await acceptFriendRequest(myProfile.value.uid, otherUid);
    await refreshFriends();
  }

  /** Decline a request or remove a friend */
  async function removeFriend(otherUid) {
    if (!myProfile.value) throw new Error('Not signed in');
    await removeFriendship(myProfile.value.uid, otherUid);
    await refreshFriends();
    // Also remove their tracks from cache
    friendsTracks.value = friendsTracks.value.filter(t => t.ownerId !== otherUid);
  }

  // ---- Shared Tracks ----

  /** Share one of my tracks to the cloud */
  async function shareTrack(track, visibility = 'friends') {
    if (!myProfile.value) throw new Error('Not signed in');
    const ownerName = myProfile.value.displayName || 'Hunter';
    const trackId = await shareTrackToCloud(myProfile.value.uid, ownerName, track, visibility);
    mySharedTrackIds.value.add(track.id);
    return trackId;
  }

  /** Stop sharing a track */
  async function stopSharingTrack(trackId) {
    if (!myProfile.value) throw new Error('Not signed in');
    await unshareTrack(myProfile.value.uid, trackId);
    mySharedTrackIds.value.delete(trackId);
  }

  /** Check if a track is currently shared */
  function isTrackShared(trackId) {
    return mySharedTrackIds.value.has(trackId);
  }

  /** Load my shared track IDs (to show cloud icons in UI) */
  async function loadMySharedTracks() {
    if (!myProfile.value) return;
    const tracks = await getSharedTracksByUser(myProfile.value.uid);
    mySharedTrackIds.value = new Set(
      tracks.map(t => t.id.replace(`${myProfile.value.uid}_`, ''))
    );
    _saveStateToCache();
    return tracks;
  }

  /** Load shared tracks from all friends */
  async function loadFriendsTracks() {
    if (!myProfile.value || friends.value.length === 0) {
      friendsTracks.value = [];
      return [];
    }

    const friendUids = friends.value.map(f => f.uid);
    const tracks = await getFriendsSharedTracks(friendUids);
    friendsTracks.value = tracks;
    _saveStateToCache();
    return tracks;
  }

  // ---- Hidden Tracks ----

  /** Hide a friend's track */
  function hideFriendTrack(trackId) {
    if (!hiddenFriendTrackIds.value.includes(trackId)) {
      hiddenFriendTrackIds.value = [...hiddenFriendTrackIds.value, trackId];
    }
  }

  /** Unhide a friend's track */
  function unhideFriendTrack(trackId) {
    hiddenFriendTrackIds.value = hiddenFriendTrackIds.value.filter(id => id !== trackId);
  }

  /** Unhide all friend tracks */
  function unhideAllFriendTracks() {
    hiddenFriendTrackIds.value = [];
  }

  /** Check if a friend track is hidden */
  function isFriendTrackHidden(trackId) {
    return hiddenFriendTrackIds.value.includes(trackId);
  }

  // ---- Export / Import (for backup system) ----

  /** Export persistent settings for backup */
  function exportData() {
    return {
      hiddenFriendTrackIds: [...hiddenFriendTrackIds.value]
    };
  }

  /** Import persistent settings from backup */
  function importData(data) {
    if (!data) return false;
    try {
      if (Array.isArray(data.hiddenFriendTrackIds)) {
        hiddenFriendTrackIds.value = data.hiddenFriendTrackIds;
      }
      return true;
    } catch (err) {
      console.error('Failed to import friends store data:', err);
      return false;
    }
  }

  /** Refresh everything (friends + tracks) — only on explicit user action */
  async function refreshAll() {
    isLoading.value = true;
    try {
      await refreshFriends();
      await loadMySharedTracks();
      if (friends.value.length > 0) {
        await loadFriendsTracks();
      }
    } catch (err) {
      console.error('Friends refresh failed:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    // State
    myProfile,
    friends,
    pendingIncoming,
    pendingSent,
    friendsTracks,
    mySharedTrackIds,
    hiddenFriendTrackIds,
    isLoading,
    isInitialized,
    lastRefresh,
    error,
    // Computed
    friendCode,
    friendCount,
    pendingCount,
    hasPending,
    // Actions
    init,
    reset,
    refreshFriends,
    addFriendByCode,
    acceptRequest,
    removeFriend,
    shareTrack,
    stopSharingTrack,
    isTrackShared,
    loadMySharedTracks,
    loadFriendsTracks,
    refreshAll,
    hideFriendTrack,
    unhideFriendTrack,
    unhideAllFriendTracks,
    isFriendTrackHidden,
    exportData,
    importData
  };
});

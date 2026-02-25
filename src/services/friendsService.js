/**
 * Friends Service for CIFI Tools
 * Manages friend codes, friendships, and shared tracks via Firestore
 * 
 * Firestore Collections:
 *   users/{uid}         - User profile with friendCode, displayName, photoURL
 *   friendships/{id}    - Friendship documents (from, to, status)
 *   sharedTracks/{id}   - Shared TR tracks visible to friends
 */
import { db } from './firebase';
import {
  doc, getDoc, setDoc, updateDoc, deleteDoc,
  collection, query, where, getDocs, serverTimestamp, writeBatch
} from 'firebase/firestore/lite';

// ----- Friend Code Generation -----

/** Generate a short unique friend code like "CIFI-A7X3" */
function generateFriendCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1 to avoid confusion
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CIFI-${code}`;
}

// ----- User Profile -----

/**
 * Get or create a user profile document.
 * Creates a friendCode on first call.
 */
export async function ensureUserProfile(uid, displayName, photoURL, email) {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    const data = snap.data();
    // Update displayName / photoURL if they changed
    const updates = {};
    if (displayName && displayName !== data.displayName) updates.displayName = displayName;
    if (photoURL && photoURL !== data.photoURL) updates.photoURL = photoURL;
    if (email && email !== data.email) updates.email = email;
    if (Object.keys(updates).length > 0) {
      updates.updatedAt = serverTimestamp();
      await updateDoc(ref, updates);
    }
    return { uid, ...data, ...updates };
  }

  // First time — create profile with unique friend code
  let friendCode = generateFriendCode();
  // Ensure uniqueness (very unlikely collision with 4 chars but let's be safe)
  let attempts = 0;
  while (attempts < 5) {
    const q = query(collection(db, 'users'), where('friendCode', '==', friendCode));
    const existing = await getDocs(q);
    if (existing.empty) break;
    friendCode = generateFriendCode();
    attempts++;
  }

  const profile = {
    displayName: 'CIFI Player', // Default name, user will be prompted to change it
    photoURL: photoURL || null,
    email: email || null,
    friendCode,
    hasSetUsername: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  await setDoc(ref, profile);
  return { uid, ...profile };
}

/** Get a user profile by uid */
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { uid, ...snap.data() } : null;
}

/** Find a user by their friend code */
export async function findUserByFriendCode(friendCode) {
  const normalized = friendCode.trim().toUpperCase();
  const q = query(collection(db, 'users'), where('friendCode', '==', normalized));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return { uid: docSnap.id, ...docSnap.data() };
}

// ----- Friendships -----

/** Canonical friendship document ID — always sorted so A→B and B→A yield the same doc */
function friendshipId(uidA, uidB) {
  return [uidA, uidB].sort().join('_');
}

/**
 * Send a friend request.
 * If the other user already sent one, auto-accept.
 */
export async function sendFriendRequest(fromUid, toUid) {
  if (fromUid === toUid) throw new Error('Cannot friend yourself');

  const id = friendshipId(fromUid, toUid);
  const ref = doc(db, 'friendships', id);

  // getDoc may throw permission-denied if the document doesn't exist yet,
  // because the read rule requires request.auth.uid in resource.data.users
  // and resource.data is empty for non-existent documents.
  let snap = null;
  try {
    snap = await getDoc(ref);
  } catch (e) {
    // Permission-denied → document doesn't exist yet, proceed to create
  }

  if (snap && snap.exists()) {
    const data = snap.data();
    if (data.status === 'accepted') return { status: 'already_friends' };
    // If the OTHER user sent a pending request → auto-accept
    if (data.status === 'pending' && data.from === toUid) {
      await updateDoc(ref, { status: 'accepted', acceptedAt: serverTimestamp() });
      return { status: 'accepted' };
    }
    // If WE already sent pending
    if (data.status === 'pending' && data.from === fromUid) {
      return { status: 'already_pending' };
    }
  }

  // Create new pending request
  await setDoc(ref, {
    from: fromUid,
    to: toUid,
    users: [fromUid, toUid],
    status: 'pending',
    createdAt: serverTimestamp()
  });

  return { status: 'pending' };
}

/** Accept a pending friend request */
export async function acceptFriendRequest(myUid, otherUid) {
  const id = friendshipId(myUid, otherUid);
  const ref = doc(db, 'friendships', id);

  await updateDoc(ref, {
    status: 'accepted',
    acceptedAt: serverTimestamp()
  });
}

/** Decline or remove a friendship */
export async function removeFriendship(uidA, uidB) {
  const id = friendshipId(uidA, uidB);
  await deleteDoc(doc(db, 'friendships', id));
}

/**
 * Get all friendships for a user (accepted + pending incoming).
 * Returns { friends: [...], pendingIncoming: [...], pendingSent: [...] }
 * 
 * Uses the "users" array field so we only need ONE query (saves reads).
 */
export async function getFriendships(myUid) {
  const q = query(
    collection(db, 'friendships'),
    where('users', 'array-contains', myUid)
  );
  const snap = await getDocs(q);

  const friends = [];
  const pendingIncoming = [];
  const pendingSent = [];

  snap.forEach(docSnap => {
    const data = docSnap.data();
    const otherUid = data.from === myUid ? data.to : data.from;

    const entry = { uid: otherUid, ...data };

    if (data.status === 'accepted') {
      friends.push(entry);
    } else if (data.status === 'pending') {
      if (data.to === myUid) {
        pendingIncoming.push(entry);
      } else {
        pendingSent.push(entry);
      }
    }
  });

  return { friends, pendingIncoming, pendingSent };
}

/**
 * Batch-fetch user profiles for a list of uids.
 * Firestore lite doesn't have getAll, so we parallel-fetch.
 * Cached in memory for the session.
 */
const profileCache = new Map();

export async function getUserProfiles(uids) {
  const result = {};
  const toFetch = [];

  for (const uid of uids) {
    if (profileCache.has(uid)) {
      result[uid] = profileCache.get(uid);
    } else {
      toFetch.push(uid);
    }
  }

  if (toFetch.length > 0) {
    const promises = toFetch.map(uid => getUserProfile(uid));
    const profiles = await Promise.all(promises);
    profiles.forEach(profile => {
      if (profile) {
        profileCache.set(profile.uid, profile);
        result[profile.uid] = profile;
      }
    });
  }

  return result;
}

/** Clear profile cache (e.g. on sign-out) */
export function clearProfileCache() {
  profileCache.clear();
}

// ----- Shared Tracks -----

/**
 * Share a TR track to the cloud (friends-only or public).
 * Stores track data in Firestore for friends to see.
 */
export async function shareTrackToCloud(uid, ownerName, track, visibility = 'friends') {
  const trackId = `${uid}_${track.id}`;
  const ref = doc(db, 'sharedTracks', trackId);

  await setDoc(ref, {
    ownerId: uid,
    ownerName: ownerName || 'Hunter',
    visibility, // 'friends' | 'public' | 'unlisted'
    trackMeta: {
      name: track.name,
      trCount: track.trCount,
      startDate: track.startDate,
      endDate: track.endDate || null,
      isActive: track.isActive,
      entryCount: (track.entries || []).length
    },
    initialValues: track.initialValues || {},
    targetGoals: track.targetGoals || {},
    entries: (track.entries || []).map(e => ({
      date: e.date,
      values: e.values,
      notes: e.notes || '',
      id: e.id
    })),
    selectedResources: track.selectedResources || [],
    resourceOrder: track.resourceOrder || [],
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp()
  }, { merge: true }); // merge to keep createdAt on updates

  return trackId;
}

/** Remove a shared track from the cloud */
export async function unshareTrack(uid, trackId) {
  const sharedId = `${uid}_${trackId}`;
  await deleteDoc(doc(db, 'sharedTracks', sharedId));
}

/** Get all tracks shared by a specific user */
export async function getSharedTracksByUser(ownerUid) {
  const q = query(
    collection(db, 'sharedTracks'),
    where('ownerId', '==', ownerUid)
  );
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/**
 * Get shared tracks from all friends of the current user.
 * Batches queries to reduce reads (one query per friend).
 */
export async function getFriendsSharedTracks(friendUids) {
  if (!friendUids || friendUids.length === 0) return [];

  // Firestore "in" operator supports up to 30 values
  const chunks = [];
  for (let i = 0; i < friendUids.length; i += 30) {
    chunks.push(friendUids.slice(i, i + 30));
  }

  const allTracks = [];
  for (const chunk of chunks) {
    const q = query(
      collection(db, 'sharedTracks'),
      where('ownerId', 'in', chunk)
    );
    const snap = await getDocs(q);
    snap.docs.forEach(d => {
      const data = d.data();
      // Only include tracks visible to friends
      if (data.visibility === 'friends' || data.visibility === 'public') {
        allTracks.push({ id: d.id, ...data });
      }
    });
  }

  return allTracks;
}

/** Get a single shared track by document ID (for public/unlisted links) */
export async function getSharedTrack(sharedTrackId) {
  const snap = await getDoc(doc(db, 'sharedTracks', sharedTrackId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

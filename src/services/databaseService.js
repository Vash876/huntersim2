import { supabase } from './supabaseConfig';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Fingerprint für anonyme Nutzeridentifikation initialisieren
let fingerprint = null;
const fpPromise = FingerprintJS.load();

// Fingerprint des Browsers holen
async function getFingerprint() {
  if (fingerprint) return fingerprint;
  
  const fp = await fpPromise;
  const result = await fp.get();
  fingerprint = result.visitorId;
  return fingerprint;
}

// Build hochladen
export async function uploadBuild(buildData, uploaderName, description, tags) {
  const { data, error } = await supabase
    .from('builds')
    .insert([{
      build_data: buildData,
      hunter_id: buildData.hunterId,
      name: buildData.name,
      description,
      uploader_name: uploaderName,
      upload_timestamp: new Date().toISOString(),
      tags,
      likes: 0,
      performance: {
        avg_stage: buildData.results?.avgStage || 0,
        loot_per_min: buildData.results?.lootPerMin || 0,
        avg_time: buildData.results?.avgTime || 0
      }
    }]);
    
  if (error) throw error;
  return data;
}

// Builds abrufen mit Filtern
export async function getBuilds({ hunterId = null, sortBy = 'timestamp', sortDirection = 'desc', limitCount = 50, tags = [] }) {
  // Query vorbereiten
  let query = supabase
    .from('builds')
    .select('*');
  
  // Filter anwenden
  if (hunterId) {
    query = query.eq('hunter_id', hunterId);
  }
  
  // Tags filtern (wenn vorhanden)
  if (tags && tags.length > 0) {
    // In Supabase müssen wir prüfen, ob Tags überlappen
    query = query.contains('tags', tags);
  }
  
  // Sortierung anwenden
  let sortField = 'upload_timestamp';
  
  if (sortBy === 'likes') sortField = 'likes';
  else if (sortBy === 'avgStage') sortField = 'performance->avg_stage';
  else if (sortBy === 'lootPerMin') sortField = 'performance->loot_per_min';
  
  query = query.order(sortField, { ascending: sortDirection === 'asc' });
  
  // Limit anwenden
  if (limitCount) {
    query = query.limit(limitCount);
  }
  
  // Anfrage ausführen
  const { data, error } = await query;
  
  if (error) throw error;
  
  // Überprüfe für jeden Build, ob der aktuelle User ihn geliked hat
  const userFp = await getFingerprint();
  const likedBuilds = await getUserLikes(userFp);
  
  // Formatiere die Daten und füge Like-Info hinzu
  return data.map(build => ({
    id: build.id,
    buildData: build.build_data,
    hunterId: build.hunter_id,
    name: build.name,
    description: build.description,
    uploaderName: build.uploader_name,
    uploadTimestamp: build.upload_timestamp,
    tags: build.tags || [],
    likes: build.likes || 0,
    performance: build.performance || {},
    isLikedByUser: likedBuilds.includes(build.id)
  }));
}

// Einzelnen Build abrufen
export async function getBuildById(buildId) {
  const { data, error } = await supabase
    .from('builds')
    .select('*')
    .eq('id', buildId)
    .single();
  
  if (error) throw error;
  if (!data) return null;
  
  // Prüfen, ob der User diesen Build geliked hat
  const userFp = await getFingerprint();
  const isLiked = await hasUserLikedBuild(buildId, userFp);
  
  return {
    id: data.id,
    buildData: data.build_data,
    hunterId: data.hunter_id,
    name: data.name,
    description: data.description,
    uploaderName: data.uploader_name,
    uploadTimestamp: data.upload_timestamp,
    tags: data.tags || [],
    likes: data.likes || 0,
    performance: data.performance || {},
    isLikedByUser: isLiked
  };
}

// Build liken oder Unlike
export async function toggleLikeBuild(buildId) {
  const userFp = await getFingerprint();
  const isLiked = await hasUserLikedBuild(buildId, userFp);
  
  // Transaktion durchführen: Like + Zähler aktualisieren
  if (isLiked) {
    // Like entfernen
    const { error: unlikeError } = await supabase
      .from('likes')
      .delete()
      .eq('fingerprint_id', userFp)
      .eq('build_id', buildId);
      
    if (unlikeError) throw unlikeError;
    
    // Like-Zähler verringern
    const { error: updateError } = await supabase
      .from('builds')
      .update({ likes: supabase.rpc('decrement', { x: 1 }) })
      .eq('id', buildId);
      
    if (updateError) throw updateError;
    
    return false; // Nicht mehr geliked
  } else {
    // Like hinzufügen
    const { error: likeError } = await supabase
      .from('likes')
      .insert([{ 
        fingerprint_id: userFp, 
        build_id: buildId,
        created_at: new Date().toISOString()
      }]);
      
    if (likeError) throw likeError;
    
    // Like-Zähler erhöhen
    const { error: updateError } = await supabase
      .from('builds')
      .update({ likes: supabase.rpc('increment', { x: 1 }) })
      .eq('id', buildId);
      
    if (updateError) throw updateError;
    
    return true; // Jetzt geliked
  }
}

// Prüfen, ob User einen Build geliked hat
export async function hasUserLikedBuild(buildId, fingerprintId = null) {
  const userFp = fingerprintId || await getFingerprint();
  
  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('fingerprint_id', userFp)
    .eq('build_id', buildId);
    
  if (error) throw error;
  
  return data && data.length > 0;
}

// Alle Likes eines Users abrufen
export async function getUserLikes(fingerprintId = null) {
  const userFp = fingerprintId || await getFingerprint();
  
  const { data, error } = await supabase
    .from('likes')
    .select('build_id')
    .eq('fingerprint_id', userFp);
    
  if (error) throw error;
  
  return data ? data.map(like => like.build_id) : [];
}

// Build löschen (nur für Admin)
export async function deleteBuild(buildId, adminKey) {
  // Einfache Admin-Überprüfung
  if (adminKey !== import.meta.env.VITE_ADMIN_KEY) {
    throw new Error('Unauthorized');
  }
  
  const { error } = await supabase
    .from('builds')
    .delete()
    .eq('id', buildId);
    
  if (error) throw error;
  return true;
}

// Top-Builds abrufen (für Dashboard/Homepage)
export async function getTopBuilds(limitCount = 5) {
  const { data, error } = await supabase
    .from('builds')
    .select('*')
    .order('likes', { ascending: false })
    .limit(limitCount);
    
  if (error) throw error;
  
  return data.map(build => ({
    id: build.id,
    buildData: build.build_data,
    name: build.name,
    hunterId: build.hunter_id,
    likes: build.likes || 0,
    tags: build.tags || []
  }));
}
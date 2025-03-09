/**
 * Simple symmetric encryption/decryption utilities
 * Uses AES-GCM for encryption through the Web Crypto API
 */

// Encryption key - in a real app, this should be securely stored or derived
// For this example, we'll use a simple fixed key for demonstration
const SECRET_KEY = 'hunterSimulator2SecretKey123!';

// Convert string to ArrayBuffer
function str2ab(str) {
  const enc = new TextEncoder();
  return enc.encode(str).buffer;
}

// Get encryption key
async function getKey() {
  // Convert the secret key string to an ArrayBuffer
  const keyData = str2ab(SECRET_KEY);
  
  // Use SHA-256 to derive a suitable key
  const digest = await window.crypto.subtle.digest('SHA-256', keyData);
  
  // Import the key for AES-GCM
  return window.crypto.subtle.importKey(
    'raw',
    digest,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

// Encrypt data
export async function encryptData(data) {
  try {
    // Generate initialization vector (IV)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Get encryption key
    const key = await getKey();
    
    // Encrypt the data
    const dataBuffer = str2ab(data);
    const encryptedBuffer = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      dataBuffer
    );
    
    // Combine IV and encrypted data
    const result = new Uint8Array(iv.length + new Uint8Array(encryptedBuffer).length);
    result.set(iv);
    result.set(new Uint8Array(encryptedBuffer), iv.length);
    
    // Convert to base64 string for easier handling
    return btoa(String.fromCharCode(...result));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

// Decrypt data
export async function decryptData(encryptedData) {
  try {
    // Convert from base64 to Uint8Array
    const data = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0));
    
    // Extract IV (first 12 bytes)
    const iv = data.slice(0, 12);
    const encryptedBuffer = data.slice(12);
    
    // Get encryption key
    const key = await getKey();
    
    // Decrypt
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      encryptedBuffer
    );
    
    // Convert back to string
    return new TextDecoder().decode(decryptedBuffer);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt data');
  }
}
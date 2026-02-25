/**
 * Firebase Configuration for CIFI Tools
 * Initializes Firebase App, Auth, and Firestore
 */
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore/lite';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyA01aIr4_oqgoCvpB3B9ttfTo4Vedrbwj4",
  authDomain: "cifi-tools-75fbf.firebaseapp.com",
  projectId: "cifi-tools-75fbf",
  storageBucket: "cifi-tools-75fbf.firebasestorage.app",
  messagingSenderId: "109155916282",
  appId: "1:109155916282:web:376a9cde0ec2be1cd12c43",
  measurementId: "G-YMWGD43BZN"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

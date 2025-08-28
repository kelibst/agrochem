import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, User } from 'firebase/auth';
import { getFirestore, Firestore, Timestamp, GeoPoint } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration (extracted from google-services.json)
const firebaseConfig = {
  apiKey: "AIzaSyDthGL5hjurMEfMc82kU1wcbdw7xfFOh_M",
  authDomain: "agrochem-d25c0.firebaseapp.com",
  projectId: "agrochem-d25c0",
  storageBucket: "agrochem-d25c0.firebasestorage.app",
  messagingSenderId: "891643661690",
  appId: "1:891643661690:android:74ad55152e9f9fff92dac3"
};

// Initialize Firebase app
export let firebaseApp: FirebaseApp;
export let firebaseAuth: Auth;
export let firebaseFirestore: Firestore;
export let firebaseStorage: FirebaseStorage;

// Initialize Firebase
export const initializeFirebase = async (): Promise<boolean> => {
  try {
    // Initialize Firebase app
    firebaseApp = initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    firebaseAuth = getAuth(firebaseApp);
    firebaseFirestore = getFirestore(firebaseApp);
    firebaseStorage = getStorage(firebaseApp);
    
    console.log('✅ Firebase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    return false;
  }
};

// Check if Firebase is properly configured
export const checkFirebaseConfig = async (): Promise<{
  isConfigured: boolean;
  services: {
    auth: boolean;
    firestore: boolean;
    storage: boolean;
  };
}> => {
  const services = {
    auth: false,
    firestore: false,
    storage: false,
  };

  try {
    // Check Auth
    services.auth = !!firebaseAuth;
    
    // Check Firestore
    services.firestore = !!firebaseFirestore;
    
    // Check Storage
    services.storage = !!firebaseStorage;
    
    const isConfigured = Object.values(services).every(Boolean);
    
    if (isConfigured) {
      console.log('✅ All Firebase services are properly configured');
    } else {
      console.warn('⚠️ Some Firebase services may not be configured:', services);
    }
    
    return { isConfigured, services };
  } catch (error) {
    console.error('❌ Firebase configuration check failed:', error);
    return { isConfigured: false, services };
  }
};

// Export types for use throughout the app
export type FirebaseUser = User;
export type FirestoreTimestamp = Timestamp;
export type FirestoreGeoPoint = GeoPoint;
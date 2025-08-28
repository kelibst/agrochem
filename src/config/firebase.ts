import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, User } from 'firebase/auth';
import { Firestore, Timestamp, GeoPoint, initializeFirestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
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
    
    // Initialize Firebase Auth - use getAuth for React Native
    firebaseAuth = getAuth(firebaseApp);
    
    // Initialize Firestore with React Native optimized settings
    firebaseFirestore = initializeFirestore(firebaseApp, {
      experimentalForceLongPolling: true, // For React Native
      experimentalAutoDetectLongPolling: false, // Disable auto-detection
    });
    
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
    messaging: boolean;
  };
}> => {
  const services = {
    auth: false,
    firestore: false,
    storage: false,
    messaging: false, // Add messaging for consistency with FirebaseTest component
  };

  try {
    // Check Auth
    services.auth = !!firebaseAuth;
    
    // Check Firestore
    services.firestore = !!firebaseFirestore;
    
    // Check Storage
    services.storage = !!firebaseStorage;
    
    // Messaging is not initialized yet, so mark as false for now
    services.messaging = false;
    
    // Consider the configuration complete if auth, firestore, and storage are available
    // (messaging is optional for now)
    const isConfigured = services.auth && services.firestore && services.storage;
    
    if (isConfigured) {
      console.log('✅ All Firebase services are properly configured');
    } else {
      console.warn('⚠️ Some Firebase services may not be configured:', services);
    }
    
    // Note: Firestore connection testing is handled in firestoreService.checkConnection()
    
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
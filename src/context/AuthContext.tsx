import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged 
} from 'firebase/auth';
import { firebaseAuth, FirebaseUser } from '@/config/firebase';
import { User, UserRole, CreateUserProfileData } from '@/types/firebase';
import { firestoreService } from '@/services/firestore';

export interface AuthContextType {
  // Auth state
  user: FirebaseUser | null;
  userProfile: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  // Auth methods
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, userData: CreateUserProfileData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  
  // Profile methods
  refreshUserProfile: () => Promise<void>;
  updateUserProfile: (updates: Partial<User['profile']>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      try {
        setIsLoading(true);
        setUser(firebaseUser);
        
        if (firebaseUser) {
          // User is signed in, fetch their profile
          await loadUserProfile(firebaseUser.uid);
        } else {
          // User is signed out
          setUserProfile(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setUserProfile(null);
      } finally {
        setIsLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  // Load user profile from Firestore
  const loadUserProfile = async (uid: string) => {
    try {
      console.log('🔄 Loading user profile for UID:', uid);
      
      // Check Firestore connection first
      const isConnected = await firestoreService.checkConnection();
      if (!isConnected) {
        console.warn('⚠️ Firestore appears to be offline, attempting to load profile anyway...');
      }
      
      const profile = await firestoreService.getUserProfile(uid);
      if (profile) {
        console.log('✅ User profile loaded successfully:', profile.email);
        setUserProfile(profile);
      } else {
        console.warn('⚠️ User profile not found - this may happen if:');
        console.warn('  1. Firestore database is not created in Firebase Console');
        console.warn('  2. User profile document does not exist (need to register again)');
        console.warn('  3. Firestore security rules are blocking access');
        setUserProfile(null);
      }
    } catch (error: any) {
      console.error('❌ Failed to load user profile:', error);
      
      // Handle specific error scenarios
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.warn('📱 Firestore is offline - profile will load when connection is restored');
      } else if (error.code === 'permission-denied') {
        console.error('🔒 Permission denied - check Firestore security rules');
      } else if (error.code === 'not-found') {
        console.warn('📄 Firestore database or collection not found - check Firebase Console setup');
      }
      
      setUserProfile(null);
    }
  };

  // Login method
  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      if (!firebaseAuth) {
        console.error('Firebase Auth is not initialized');
        return { success: false, error: 'Authentication service not ready. Please try again.' };
      }
      
      console.log('Attempting login with email:', email);
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
      
      if (userCredential.user) {
        console.log('Login successful, loading user profile...');
        await loadUserProfile(userCredential.user.uid);
        return { success: true };
      } else {
        return { success: false, error: 'Login failed - no user returned' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return { 
        success: false, 
        error: getAuthErrorMessage(error.code) 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Register method
  const register = async (
    email: string, 
    password: string, 
    userData: CreateUserProfileData
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      if (!firebaseAuth) {
        console.error('Firebase Auth is not initialized');
        return { success: false, error: 'Authentication service not ready. Please try again.' };
      }
      
      console.log('Attempting registration with email:', email);
      // Create Firebase auth user
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      
      if (!userCredential.user) {
        return { success: false, error: 'Registration failed - no user created' };
      }

      // Create user profile in Firestore
      const profileResult = await firestoreService.createUserProfile(
        userCredential.user.uid,
        userData
      );

      if (!profileResult.success) {
        // If profile creation fails, delete the auth user
        await userCredential.user.delete();
        return { success: false, error: profileResult.error };
      }

      // Load the newly created profile
      await loadUserProfile(userCredential.user.uid);
      
      return { success: true };
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error code:', error.code);
      console.error('Error message:', error.message);
      return { 
        success: false, 
        error: getAuthErrorMessage(error.code) 
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout method
  const logout = async (): Promise<void> => {
    try {
      await signOut(firebaseAuth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Reset password method
  const resetPassword = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      await sendPasswordResetEmail(firebaseAuth, email);
      return { success: true };
    } catch (error: any) {
      console.error('Password reset error:', error);
      return { 
        success: false, 
        error: getAuthErrorMessage(error.code) 
      };
    }
  };

  // Refresh user profile
  const refreshUserProfile = async (): Promise<void> => {
    if (user) {
      await loadUserProfile(user.uid);
    }
  };

  // Update user profile
  const updateUserProfile = async (
    updates: Partial<User['profile']>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user || !userProfile) {
      return { success: false, error: 'No authenticated user' };
    }

    try {
      const result = await firestoreService.updateUserProfile(user.uid, updates);
      
      if (result.success) {
        // Update local state
        setUserProfile(prev => prev ? {
          ...prev,
          profile: { ...prev.profile, ...updates }
        } : null);
      }
      
      return result;
    } catch (error: any) {
      console.error('Profile update error:', error);
      return { success: false, error: error.message };
    }
  };

  const contextValue: AuthContextType = {
    user,
    userProfile,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    resetPassword,
    refreshUserProfile,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Helper function to convert Firebase auth error codes to user-friendly messages
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters long.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/configuration-not-found':
      return 'Firebase configuration error. Please check your setup.';
    default:
      return 'An error occurred. Please try again.';
  }
};
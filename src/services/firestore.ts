import { 
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { 
  firebaseFirestore
} from '@/config/firebase';
import { 
  User, 
  CreateUserProfileData,
  ApiResponse 
} from '@/types/firebase';

class FirestoreService {
  private get db() {
    if (!firebaseFirestore) {
      throw new Error('Firestore is not initialized');
    }
    return firebaseFirestore;
  }

  // Check Firestore connection health
  async checkConnection(): Promise<boolean> {
    try {
      // Try to read from a non-existent collection to test connection
      const testDoc = await getDoc(doc(collection(this.db, '_health_check'), 'test'));
      return true; // Connection successful even if doc doesn't exist
    } catch (error: any) {
      console.warn('Firestore connection check failed:', error);
      return false;
    }
  }

  // Helper method to create timestamps
  private getTimestamp() {
    return serverTimestamp();
  }

  // Helper method to handle Firestore errors
  private handleFirestoreError(error: any): ApiResponse {
    console.error('Firestore error:', error);
    return {
      success: false,
      error: error.message || 'Database operation failed',
    };
  }

  // User Profile Operations
  async createUserProfile(uid: string, userData: CreateUserProfileData): Promise<ApiResponse<User>> {
    try {
      console.log('Creating user profile for UID:', uid);
      console.log('Firestore instance:', this.db);
      
      const now = this.getTimestamp();
      const userDoc: User = {
        uid,
        email: userData.email,
        role: userData.role,
        profile: userData.profile,
        createdAt: now as any,
        updatedAt: now as any,
      };

      console.log('User document to create:', userDoc);
      await setDoc(doc(collection(this.db, 'users'), uid), userDoc);
      console.log('User profile created successfully');
      
      return {
        success: true,
        data: userDoc,
        message: 'User profile created successfully',
      };
    } catch (error) {
      return this.handleFirestoreError(error);
    }
  }

  async getUserProfile(uid: string, retries: number = 3): Promise<User | null> {
    try {
      console.log('Getting user profile for UID:', uid);
      console.log('Firestore instance:', this.db);
      
      const userDocRef = doc(collection(this.db, 'users'), uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        console.log('User profile does not exist');
        return null;
      }
      
      console.log('User profile retrieved successfully');
      return userDoc.data() as User;
    } catch (error: any) {
      console.error('Failed to get user profile:', error);
      
      // Handle specific offline/network errors with retry logic
      if ((error.code === 'unavailable' || error.message?.includes('offline') || error.code === 'deadline-exceeded') && retries > 0) {
        console.warn(`Firestore connection issue, retrying... (${retries} attempts left)`);
        
        // Wait a bit before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
        
        return this.getUserProfile(uid, retries - 1);
      }
      
      if (error.code === 'unavailable' || error.message?.includes('offline')) {
        console.warn('Firestore is offline, user profile unavailable');
        // Return null to trigger fallback behavior
      }
      
      return null;
    }
  }

  async updateUserProfile(uid: string, updates: Partial<User['profile']>): Promise<ApiResponse> {
    try {
      await updateDoc(doc(collection(this.db, 'users'), uid), {
        profile: updates,
        updatedAt: this.getTimestamp(),
      });
      
      return {
        success: true,
        message: 'Profile updated successfully',
      };
    } catch (error) {
      return this.handleFirestoreError(error);
    }
  }
}

// Export singleton instance
export const firestoreService = new FirestoreService();
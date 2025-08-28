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

  async getUserProfile(uid: string): Promise<User | null> {
    try {
      console.log('Getting user profile for UID:', uid);
      console.log('Firestore instance:', this.db);
      
      const userDoc = await getDoc(doc(collection(this.db, 'users'), uid));
      
      if (!userDoc.exists()) {
        console.log('User profile does not exist');
        return null;
      }
      
      console.log('User profile retrieved successfully');
      return userDoc.data() as User;
    } catch (error) {
      console.error('Failed to get user profile:', error);
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
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  Timestamp,
  DocumentReference,
} from 'firebase/firestore';
import FirebaseService from './firebase';
import { UserProfile } from '../types/auth';

/**
 * UserProfileService - Handles all Firestore user profile operations
 */
class UserProfileService {
  private db = FirebaseService.db;
  private collectionName = 'users';

  /**
   * Get user profile by UID
   */
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    try {
      const userRef = doc(this.db, this.collectionName, uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        return null;
      }

      return userSnap.data() as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  /**
   * Create new user profile
   */
  async createUserProfile(
    uid: string,
    data: Omit<UserProfile, 'uid' | 'createdAt' | 'lastLoginAt'>
  ): Promise<UserProfile> {
    try {
      const now = Date.now();
      const profile: UserProfile = {
        uid,
        ...data,
        createdAt: now,
        lastLoginAt: now,
      };

      const userRef = doc(this.db, this.collectionName, uid);
      await setDoc(userRef, profile);

      return profile;
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateUserProfile(
    uid: string,
    updates: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
  ): Promise<void> {
    try {
      const userRef = doc(this.db, this.collectionName, uid);
      await updateDoc(userRef, {
        ...updates,
        lastLoginAt: Date.now(),
      });
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  /**
   * Update last login timestamp
   */
  async updateLastLogin(uid: string): Promise<void> {
    try {
      const userRef = doc(this.db, this.collectionName, uid);
      await updateDoc(userRef, {
        lastLoginAt: Date.now(),
      });
    } catch (error) {
      console.error('Error updating last login:', error);
      throw error;
    }
  }

  /**
   * Delete user profile
   */
  async deleteUserProfile(uid: string): Promise<void> {
    try {
      const userRef = doc(this.db, this.collectionName, uid);
      await setDoc(userRef, { _deleted: true }, { merge: true });
    } catch (error) {
      console.error('Error deleting user profile:', error);
      throw error;
    }
  }
}

export default new UserProfileService();

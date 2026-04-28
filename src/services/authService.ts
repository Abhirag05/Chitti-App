import FirebaseService from './firebase';
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithCredential,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';

/**
 * AuthService - Handles all Firebase authentication operations
 */
class AuthService {
  private auth = FirebaseService.auth;

  /**
   * Sign in with email and password
   */
  async signIn(email: string, password: string): Promise<User> {
    try {
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return result.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(email: string, password: string, fullName: string): Promise<User> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = result.user;

      // Update profile with full name
      if (user) {
        await updateProfile(user, {
          displayName: fullName,
        });
      }

      return user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Sign in with Google
   */
  async signInWithGoogle(idToken: string): Promise<User> {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(this.auth, credential);
      return result.user;
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Sign out
   */
  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error: any) {
      throw new Error(this.getErrorMessage(error.code));
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChanged(callback: (user: User | null) => void) {
    return onAuthStateChanged(this.auth, callback);
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  /**
   * Map Firebase error codes to user-friendly messages
   */
  private getErrorMessage(code: string): string {
    const errorMap: Record<string, string> = {
      'auth/user-not-found': 'User not found. Please check your email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/weak-password': 'Password is too weak. Please use a stronger password.',
      'auth/operation-not-allowed': 'This operation is not allowed.',
      'auth/too-many-requests': 'Too many login attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };

    return errorMap[code] || 'An authentication error occurred. Please try again.';
  }
}

export default new AuthService();

import React, { createContext, useEffect, useState, useCallback } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import authService from '@services/authService';
import userProfileService from '@services/userProfileService';
import { AuthContextType, UserProfile, LoginRequest, RegisterRequest, AuthUser } from '../types/auth';

/**
 * Auth Context - Provides authentication state and methods
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch user profile from Firestore
   */
  const fetchUserProfile = useCallback(async (uid: string) => {
    try {
      const profile = await userProfileService.getUserProfile(uid);
      if (profile) {
        setUserProfile(profile);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  }, []);

  /**
   * Listen to auth state changes
   */
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser as AuthUser);
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setInitialized(true);
    });

    return () => unsubscribe();
  }, [fetchUserProfile]);

  /**
   * Login with email and password
   */
  const login = useCallback(async (credentials: LoginRequest) => {
    try {
      setLoading(true);
      setError(null);

      const firebaseUser = await authService.signIn(credentials.email, credentials.password);

      // Update last login
      await userProfileService.updateLastLogin(firebaseUser.uid);

      // Fetch profile
      await fetchUserProfile(firebaseUser.uid);

      setUser(firebaseUser as AuthUser);
    } catch (err: any) {
      const message = err.message || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchUserProfile]);

  /**
   * Register with email and password
   */
  const register = useCallback(async (data: RegisterRequest) => {
    try {
      setLoading(true);
      setError(null);

      const firebaseUser = await authService.signUp(data.email, data.password, data.fullName);

      // Create user profile in Firestore
      const profile = await userProfileService.createUserProfile(firebaseUser.uid, {
        fullName: data.fullName,
        email: data.email,
        authProvider: 'email',
        role: 'user',
      });

      setUser(firebaseUser as AuthUser);
      setUserProfile(profile);
    } catch (err: any) {
      const message = err.message || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Login with Google
   */
  const loginWithGoogle = useCallback(async (idToken: string) => {
    try {
      setLoading(true);
      setError(null);

      const firebaseUser = await authService.signInWithGoogle(idToken);
      const uid = firebaseUser.uid;

      // Check if user profile exists
      let profile = await userProfileService.getUserProfile(uid);

      // Create profile if first login
      if (!profile) {
        profile = await userProfileService.createUserProfile(uid, {
          fullName: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          authProvider: 'google',
          photoURL: firebaseUser.photoURL || undefined,
          role: 'user',
        });
      } else {
        // Update last login for existing user
        await userProfileService.updateLastLogin(uid);
      }

      setUser(firebaseUser as AuthUser);
      setUserProfile(profile);
    } catch (err: any) {
      const message = err.message || 'Google login failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Send password reset email
   */
  const resetPassword = useCallback(async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      await authService.sendPasswordReset(email);
    } catch (err: any) {
      const message = err.message || 'Failed to send password reset email';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      await authService.signOut();
      setUser(null);
      setUserProfile(null);
    } catch (err: any) {
      const message = err.message || 'Logout failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value: AuthContextType = {
    user,
    userProfile,
    loading,
    initialized,
    error,
    login,
    register,
    loginWithGoogle,
    logout,
    resetPassword,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook to use auth context
 */
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;

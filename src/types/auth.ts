import { User as FirebaseUser } from 'firebase/auth';

/**
 * User profile data stored in Firestore
 */
export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  photoURL?: string;
  authProvider: 'email' | 'google';
  role: 'user' | 'admin';
  createdAt: number; // timestamp
  lastLoginAt: number; // timestamp
}

/**
 * Combined user object with Firebase auth + profile
 */
export interface AuthUser extends FirebaseUser {
  profile?: UserProfile;
}

/**
 * Login request payload
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

/**
 * Google login response
 */
export interface GoogleLoginResponse {
  user: AuthUser | null;
  error?: string;
}

/**
 * Auth context state
 */
export interface AuthContextType {
  user: AuthUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;

  // Methods
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

/**
 * Auth response type
 */
export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: AuthUser;
}

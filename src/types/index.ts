export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

export type User = {
  uid: string;
  email?: string | null;
};

// Re-export auth types
export type {
  UserProfile,
  AuthUser,
  LoginRequest,
  RegisterRequest,
  GoogleLoginResponse,
  AuthContextType,
  AuthResponse,
} from './auth';

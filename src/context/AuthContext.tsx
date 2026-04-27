import React, { createContext, useEffect, useState } from 'react';
import authService from '@services/authService';
import { User as FirebaseUser } from 'firebase/auth';

type AuthContextState = {
  user: FirebaseUser | null;
  initializing: boolean;
};

export const AuthContext = createContext<AuthContextState>({ user: null, initializing: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsub = authService.onAuthStateChanged((u) => {
      setUser(u as FirebaseUser | null);
      setInitializing(false);
    });
    return () => unsub();
  }, []);

  return <AuthContext.Provider value={{ user, initializing }}>{children}</AuthContext.Provider>;
};

export default AuthContext;

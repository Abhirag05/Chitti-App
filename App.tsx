import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@context/AuthContext';
import AppNavigation from '@navigation';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

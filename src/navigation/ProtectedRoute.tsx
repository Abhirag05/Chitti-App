import React from 'react';
import { View } from 'react-native';
import { useAuth } from '@context/AuthContext';
import AppLoader from '@components/ui/AppLoader';

type Props = { children: React.ReactNode };

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, initialized } = useAuth();

  if (!initialized) return <AppLoader />;
  if (!user) return <View />; // placeholder for redirect to auth stack

  return <>{children}</>;
};

export default ProtectedRoute;

import React, { useContext } from 'react';
import { View } from 'react-native';
import { AuthContext } from '@context/AuthContext';
import AppLoader from '@components/ui/AppLoader';

type Props = { children: React.ReactNode };

export const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, initializing } = useContext(AuthContext);

  if (initializing) return <AppLoader />;
  if (!user) return <View />; // placeholder for redirect to auth stack

  return <>{children}</>;
};

export default ProtectedRoute;

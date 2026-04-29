import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigation from './src/navigation';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import ConfigErrorScreen from './src/components/common/ConfigErrorScreen';
import { isEnvValid } from './src/config/env';

export default function App() {
  React.useEffect(() => {
    console.log('[App] App component mounted');
  }, []);

  if (!isEnvValid()) {
    return <ConfigErrorScreen />;
  }

  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <AuthProvider>
          <AppNavigation />
        </AuthProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}

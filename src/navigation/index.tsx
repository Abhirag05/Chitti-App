import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProtectedRoute } from './ProtectedRoute';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppText from '@components/ui/AppText';

const Stack = createNativeStackNavigator();

function PlaceholderScreen({ title }: { title: string }) {
  return (
    <ScreenContainer>
      <AppText variant="h1">{title}</AppText>
    </ScreenContainer>
  );
}

export const AppNavigation: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ headerShown: false }}>
          {() => (
            <ProtectedRoute>
              <PlaceholderScreen title="App Shell" />
            </ProtectedRoute>
          )}
        </Stack.Screen>
        <Stack.Screen name="Auth" options={{ headerShown: false }}>
          {() => <PlaceholderScreen title="Auth Shell" />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigation;

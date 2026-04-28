import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@context/AuthContext';
import AppLoader from '@components/ui/AppLoader';

// Auth Screens
import LoginScreen from '@screens/auth/LoginScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@screens/auth/ForgotPasswordScreen';

// Home Screens
import DashboardScreen from '@screens/home/DashboardScreen';

const Stack = createNativeStackNavigator();

/**
 * Auth Stack - Login, Register, Forgot Password
 */
const AuthStack = () => {
  return (
    <Stack.Navigator
      id="AuthStack"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
};

/**
 * App Stack - Protected screens for authenticated users
 */
const AppStack = () => {
  return (
    <Stack.Navigator
      id="AppStack"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
};

/**
 * Main Navigation - Conditional rendering based on auth state
 */
export const AppNavigation: React.FC = () => {
  const { initialized, user } = useAuth();

  if (!initialized) {
    return <AppLoader />;
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigation;

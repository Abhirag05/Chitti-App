import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useAuth } from '@context/AuthContext';
import AppLoader from '@components/ui/AppLoader';
import { CustomDrawerContent } from '@components/layout';
import { AppRoutes } from '@src/constants/navigation';
import { AuthStackParamList, AppDrawerParamList } from '@src/types/navigation';
import theme from '@theme';
import BorrowersNavigator from './BorrowersNavigator';

// Auth Screens
import LoginScreen from '@screens/auth/LoginScreen';
import RegisterScreen from '@screens/auth/RegisterScreen';
import ForgotPasswordScreen from '@screens/auth/ForgotPasswordScreen';

// App Screens
import DashboardScreen from '@screens/home/DashboardScreen';
import DueTodayScreen from '@screens/home/DueTodayScreen';
import OverdueScreen from '@screens/home/OverdueScreen';
import UpcomingScreen from '@screens/home/UpcomingScreen';
import AddBorrowerScreen from '@screens/home/AddBorrowerScreen';
import SettingsScreen from '@screens/home/SettingsScreen';

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const Drawer = createDrawerNavigator<AppDrawerParamList>();

/**
 * Auth Stack - Login, Register, Forgot Password
 */
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      id="AuthStack"
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
};

/**
 * App Drawer - Protected screens for authenticated users
 * Uses custom drawer content with professional sidebar design
 */
const AppNavigator = () => {
  return (
    <Drawer.Navigator
      id="AppDrawer"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerStyle: {
          width: 280,
          backgroundColor: theme.colors.drawerBackground,
        },
        swipeEnabled: true,
        swipeEdgeWidth: 50,
      }}
    >
      <Drawer.Screen name={AppRoutes.Dashboard} component={DashboardScreen} />
      <Drawer.Screen name={AppRoutes.Borrowers} component={BorrowersNavigator} />
      <Drawer.Screen name={AppRoutes.DueToday} component={DueTodayScreen} />
      <Drawer.Screen name={AppRoutes.Overdue} component={OverdueScreen} />
      <Drawer.Screen name={AppRoutes.Upcoming} component={UpcomingScreen} />
      <Drawer.Screen name={AppRoutes.AddBorrower} component={AddBorrowerScreen} />
      <Drawer.Screen name={AppRoutes.Settings} component={SettingsScreen} />
    </Drawer.Navigator>
  );
};

/**
 * Main Navigation - Conditional rendering based on auth state
 * Route protection: unauthenticated users see AuthStack, authenticated users see AppDrawer
 */
export const AppNavigation: React.FC = () => {
  const { initialized, user } = useAuth();

  if (!initialized) {
    return <AppLoader />;
  }

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigation;

import React from 'react';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppText from '@components/ui/AppText';
import AppButton from '@components/ui/AppButton';
import { useAuth } from '@context/AuthContext';
import { View, StyleSheet } from 'react-native';
import theme from '@theme';

type Props = {
  navigation: any;
};

/**
 * DashboardScreen - Placeholder for authenticated users
 */
const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { logout, userProfile } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <AppText variant="h1" style={styles.title}>
          Dashboard
        </AppText>
        {userProfile && (
          <>
            <AppText variant="body" style={styles.welcome}>
              Welcome, {userProfile.fullName}!
            </AppText>
            <AppText variant="small" style={styles.email}>
              {userProfile.email}
            </AppText>
          </>
        )}

        <View style={styles.spacer} />

        <AppButton title="Logout" onPress={handleLogout} style={styles.logoutButton} />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    marginBottom: theme.spacing.lg,
    fontWeight: 'bold',
  },
  welcome: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  email: {
    color: theme.colors.muted,
    textAlign: 'center',
  },
  spacer: {
    flex: 1,
  },
  logoutButton: {
    width: '100%',
  },
});

export default DashboardScreen;

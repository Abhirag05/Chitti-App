import React from 'react';
import { View, StyleSheet, ScrollView, Image, Alert, TouchableOpacity } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppText from '@components/ui/AppText';
import AppCard from '@components/ui/AppCard';
import AppButton from '@components/ui/AppButton';
import AppHeader from '@components/layout/AppHeader';
import { useAuth } from '@context/AuthContext';
import { AppDrawerParamList } from '@src/types/navigation';
import theme from '@theme';

type Props = {
  navigation: DrawerNavigationProp<AppDrawerParamList, 'Settings'>;
};

/**
 * Settings item for the menu list
 */
interface SettingsItem {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  subtitle?: string;
  onPress?: () => void;
  disabled?: boolean;
}

/**
 * SettingsScreen - User profile summary, logout, and future settings
 */
const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { userProfile, logout } = useAuth();

  /**
   * Handle logout with confirmation
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (err) {
              console.error('Logout failed:', err);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  /**
   * Get user initials for avatar fallback
   */
  const getUserInitials = (): string => {
    if (!userProfile?.fullName) return '?';
    const parts = userProfile.fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0][0].toUpperCase();
  };

  /**
   * Placeholder settings menu items
   */
  const settingsItems: SettingsItem[] = [
    {
      icon: 'notifications',
      label: 'Notifications',
      subtitle: 'Coming soon',
      disabled: true,
    },
    {
      icon: 'language',
      label: 'Language',
      subtitle: 'English',
      disabled: true,
    },
    {
      icon: 'security',
      label: 'Security',
      subtitle: 'Coming soon',
      disabled: true,
    },
    {
      icon: 'help-outline',
      label: 'Help & Support',
      subtitle: 'Coming soon',
      disabled: true,
    },
    {
      icon: 'info-outline',
      label: 'About',
      subtitle: 'Version 1.0.0',
      disabled: true,
    },
  ];

  return (
    <View style={styles.flex}>
      <AppHeader
        title="Settings"
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ScreenContainer style={styles.container}>
          {/* Profile Card */}
          <AppCard style={styles.profileCard}>
            <View style={styles.profileRow}>
              {userProfile?.photoURL ? (
                <Image source={{ uri: userProfile.photoURL }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <AppText style={styles.avatarText}>{getUserInitials()}</AppText>
                </View>
              )}
              <View style={styles.profileInfo}>
                <AppText variant="h3" style={styles.profileName}>
                  {userProfile?.fullName || 'User'}
                </AppText>
                <AppText variant="small" style={styles.profileEmail}>
                  {userProfile?.email || ''}
                </AppText>
                <View style={styles.roleBadge}>
                  <AppText style={styles.roleText}>
                    {userProfile?.role === 'admin' ? 'Admin' : 'User'}
                  </AppText>
                </View>
              </View>
            </View>
          </AppCard>

          {/* Account Info */}
          <AppText variant="small" style={styles.sectionHeader}>ACCOUNT</AppText>
          <AppCard style={styles.settingsCard}>
            <View style={styles.infoRow}>
              <MaterialIcons name="email" size={20} color={theme.colors.muted} />
              <View style={styles.infoContent}>
                <AppText variant="small" style={styles.infoLabel}>Email</AppText>
                <AppText variant="body" style={styles.infoValue}>{userProfile?.email || 'N/A'}</AppText>
              </View>
            </View>
            <View style={styles.rowDivider} />
            <View style={styles.infoRow}>
              <MaterialIcons name="verified-user" size={20} color={theme.colors.muted} />
              <View style={styles.infoContent}>
                <AppText variant="small" style={styles.infoLabel}>Auth Provider</AppText>
                <AppText variant="body" style={styles.infoValue}>
                  {userProfile?.authProvider === 'google' ? 'Google' : 'Email & Password'}
                </AppText>
              </View>
            </View>
            <View style={styles.rowDivider} />
            <View style={styles.infoRow}>
              <MaterialIcons name="access-time" size={20} color={theme.colors.muted} />
              <View style={styles.infoContent}>
                <AppText variant="small" style={styles.infoLabel}>Member Since</AppText>
                <AppText variant="body" style={styles.infoValue}>
                  {userProfile?.createdAt
                    ? new Date(userProfile.createdAt).toLocaleDateString()
                    : 'N/A'}
                </AppText>
              </View>
            </View>
          </AppCard>

          {/* Preferences */}
          <AppText variant="small" style={styles.sectionHeader}>PREFERENCES</AppText>
          <AppCard style={styles.settingsCard}>
            {React.Children.toArray(settingsItems.map((item, index) => (
              <View>
                <TouchableOpacity
                  style={[styles.settingsRow, item.disabled && styles.settingsRowDisabled]}
                  onPress={item.onPress}
                  disabled={item.disabled}
                  activeOpacity={0.7}
                >
                  <MaterialIcons
                    name={item.icon}
                    size={22}
                    color={item.disabled ? theme.colors.muted : theme.colors.text}
                  />
                  <View style={styles.settingsContent}>
                    <AppText
                      variant="body"
                      style={[styles.settingsLabel, item.disabled && styles.settingsLabelDisabled]}
                    >
                      {item.label}
                    </AppText>
                    {item.subtitle && (
                      <AppText variant="small" style={styles.settingsSubtitle}>
                        {item.subtitle}
                      </AppText>
                    )}
                  </View>
                  <MaterialIcons name="chevron-right" size={22} color={theme.colors.muted} />
                </TouchableOpacity>
                {index < settingsItems.length - 1 && <View style={styles.rowDivider} />}
              </View>
            )))}
          </AppCard>

          {/* Logout */}
          <View style={styles.logoutSection}>
            <AppButton
              title="Logout"
              onPress={handleLogout}
              style={styles.logoutButton}
            />
          </View>
        </ScreenContainer>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  profileCard: {
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: theme.colors.accent,
  },
  avatarFallback: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: `${theme.colors.accent}15`,
    borderWidth: 2,
    borderColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.colors.accent,
    fontSize: 24,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: theme.spacing.md,
  },
  profileName: {
    marginBottom: 2,
  },
  profileEmail: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.xs,
  },
  roleBadge: {
    backgroundColor: `${theme.colors.accent}15`,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
    alignSelf: 'flex-start',
  },
  roleText: {
    color: theme.colors.accent,
    fontSize: 11,
    fontWeight: '600',
  },
  sectionHeader: {
    color: theme.colors.muted,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    marginLeft: theme.spacing.xxs,
    letterSpacing: 0.5,
  },
  settingsCard: {
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  infoContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  infoLabel: {
    color: theme.colors.muted,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
  },
  rowDivider: {
    height: 1,
    backgroundColor: '#f1f5f9',
    marginHorizontal: theme.spacing.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
  },
  settingsRowDisabled: {
    opacity: 0.6,
  },
  settingsContent: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  settingsLabel: {
    fontSize: 14,
  },
  settingsLabelDisabled: {
    color: theme.colors.muted,
  },
  settingsSubtitle: {
    color: theme.colors.muted,
    marginTop: 1,
  },
  logoutSection: {
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  logoutButton: {
    backgroundColor: theme.colors.danger,
  },
});

export default SettingsScreen;

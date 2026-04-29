import React, { useMemo, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import AppButton from '@components/ui/AppButton';
import AppCard from '@components/ui/AppCard';
import AppHeader from '@components/layout/AppHeader';
import AppText from '@components/ui/AppText';
import ScreenContainer from '@components/ui/ScreenContainer';
import { useAuth } from '@context/AuthContext';
import errorHandler from '@services/errorHandler';
import { AppDrawerParamList } from '@src/types/navigation';
import { formatDate, getInitials } from '@src/utils/formatters';
import theme from '@theme';

type Props = {
  navigation: DrawerNavigationProp<AppDrawerParamList, 'Settings'>;
};

type SettingsItem = {
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  subtitle?: string;
  onPress?: () => void;
  disabled?: boolean;
};

const InfoRow: React.FC<{
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  label: string;
  value: string;
}> = ({ icon, label, value }) => {
  return (
    <View style={styles.infoRow}>
      <MaterialIcons name={icon} size={20} color={theme.colors.muted} />
      <View style={styles.infoContent}>
        <AppText variant="small" style={styles.infoLabel}>
          {label}
        </AppText>
        <AppText variant="body" style={styles.infoValue} numberOfLines={1}>
          {value}
        </AppText>
      </View>
    </View>
  );
};

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { userProfile, logout } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const initials = useMemo(() => getInitials(userProfile?.fullName), [userProfile?.fullName]);

  const settingsItems: SettingsItem[] = [
    { icon: 'notifications', label: 'Notifications', subtitle: 'Coming soon', disabled: true },
    { icon: 'language', label: 'Language', subtitle: 'English', disabled: true },
    { icon: 'security', label: 'Security', subtitle: 'Coming soon', disabled: true },
    { icon: 'help-outline', label: 'Help & Support', subtitle: 'Coming soon', disabled: true },
    { icon: 'info-outline', label: 'About', subtitle: 'Version 1.0.0', disabled: true },
  ];

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            setLoggingOut(true);
            setLogoutError(null);
            await logout();
          } catch (error) {
            errorHandler.log(error, 'SettingsScreen.logout');
            setLogoutError(errorHandler.format(error));
          } finally {
            setLoggingOut(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.flex}>
      <AppHeader title="Settings" onMenuPress={() => navigation.openDrawer()} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ScreenContainer style={styles.container}>
          <AppCard style={styles.profileCard}>
            <View style={styles.profileRow}>
              {userProfile?.photoURL ? (
                <Image source={{ uri: userProfile.photoURL }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarFallback}>
                  <AppText style={styles.avatarText}>{initials}</AppText>
                </View>
              )}

              <View style={styles.profileInfo}>
                <AppText variant="h3" style={styles.profileName} numberOfLines={1}>
                  {userProfile?.fullName || 'User'}
                </AppText>
                <AppText variant="small" style={styles.profileEmail} numberOfLines={1}>
                  {userProfile?.email || 'No email available'}
                </AppText>
                <View style={styles.roleBadge}>
                  <AppText style={styles.roleText}>{userProfile?.role === 'admin' ? 'Admin' : 'User'}</AppText>
                </View>
              </View>
            </View>
          </AppCard>

          <AppText variant="small" style={styles.sectionHeader}>
            ACCOUNT
          </AppText>
          <AppCard style={styles.settingsCard}>
            <InfoRow icon="email" label="Email" value={userProfile?.email || 'N/A'} />
            <View style={styles.rowDivider} />
            <InfoRow
              icon="verified-user"
              label="Auth Provider"
              value={userProfile?.authProvider === 'google' ? 'Google' : 'Email & Password'}
            />
            <View style={styles.rowDivider} />
            <InfoRow
              icon="access-time"
              label="Member Since"
              value={userProfile?.createdAt ? formatDate(userProfile.createdAt) : 'N/A'}
            />
          </AppCard>

          <AppText variant="small" style={styles.sectionHeader}>
            PREFERENCES
          </AppText>
          <AppCard style={styles.settingsCard}>
            {settingsItems.map((item, index) =>
              React.createElement(
                React.Fragment,
                { key: item.label } as any,
                <TouchableOpacity
                  style={[styles.settingsRow, item.disabled && styles.settingsRowDisabled]}
                  onPress={item.onPress}
                  disabled={item.disabled}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name={item.icon} size={22} color={item.disabled ? theme.colors.muted : theme.colors.text} />
                  <View style={styles.settingsContent}>
                    <AppText variant="body" style={[styles.settingsLabel, item.disabled && styles.settingsLabelDisabled]}>
                      {item.label}
                    </AppText>
                    {item.subtitle ? <AppText variant="small" style={styles.settingsSubtitle}>{item.subtitle}</AppText> : null}
                  </View>
                  <MaterialIcons name="chevron-right" size={22} color={theme.colors.muted} />
                </TouchableOpacity>,
                index < settingsItems.length - 1 ? <View style={styles.rowDivider} /> : null
              )
            )}
          </AppCard>

          <View style={styles.logoutSection}>
            <AppButton title="Logout" onPress={handleLogout} loading={loggingOut} style={styles.logoutButton} />
            {logoutError ? <AppText variant="small" style={styles.logoutError}>{logoutError}</AppText> : null}
          </View>
        </ScreenContainer>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: theme.colors.background },
  scrollView: { flex: 1 },
  container: { flex: 1, padding: theme.spacing.md },
  profileCard: { marginBottom: theme.spacing.lg, padding: theme.spacing.lg },
  profileRow: { flexDirection: 'row', alignItems: 'center' },
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
  avatarText: { color: theme.colors.accent, fontWeight: '700', fontSize: 20 },
  profileInfo: { flex: 1, marginLeft: theme.spacing.md },
  profileName: { marginBottom: theme.spacing.xxs },
  profileEmail: { color: theme.colors.muted, marginBottom: theme.spacing.xs },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: 999,
    backgroundColor: '#ede9fe',
  },
  roleText: { color: theme.colors.accent, fontWeight: '600' },
  sectionHeader: { marginBottom: theme.spacing.xs, color: theme.colors.muted, letterSpacing: 0.8 },
  settingsCard: { marginBottom: theme.spacing.lg, paddingVertical: 0 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.md },
  infoContent: { flex: 1, marginLeft: theme.spacing.sm },
  infoLabel: { color: theme.colors.muted },
  infoValue: { color: theme.colors.text, marginTop: theme.spacing.xxs },
  rowDivider: { height: 1, backgroundColor: '#e5e7eb' },
  settingsRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: theme.spacing.md },
  settingsRowDisabled: { opacity: 0.7 },
  settingsContent: { flex: 1, marginLeft: theme.spacing.sm, marginRight: theme.spacing.sm },
  settingsLabel: { fontWeight: '600' },
  settingsLabelDisabled: { color: theme.colors.muted },
  settingsSubtitle: { marginTop: theme.spacing.xxs, color: theme.colors.muted },
  logoutSection: { marginBottom: theme.spacing.xl },
  logoutButton: { width: '100%' },
  logoutError: { marginTop: theme.spacing.sm, color: theme.colors.danger, textAlign: 'center' },
});

export default SettingsScreen;

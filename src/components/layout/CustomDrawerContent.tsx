import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { DrawerContentComponentProps } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppText from '@components/ui/AppText';
import { useAuth } from '@context/AuthContext';
import { DRAWER_MENU_ITEMS, AppRouteName } from '@src/constants/navigation';
import theme from '@theme';

/**
 * CustomDrawerContent - Professional sidebar with user profile, menu items, and logout
 */
const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { navigation, state } = props;
  const { userProfile, logout } = useAuth();
  const insets = useSafeAreaInsets();

  const activeRouteName = state.routes[state.index]?.name as AppRouteName;

  /**
   * Handle navigation to a drawer screen
   */
  const handleNavigate = (route: AppRouteName) => {
    navigation.navigate(route);
  };

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

  const primaryItems = DRAWER_MENU_ITEMS.filter((item) => item.isPrimary);
  const secondaryItems = DRAWER_MENU_ITEMS.filter((item) => !item.isPrimary);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* User Profile Section */}
      <View style={styles.profileSection}>
        {userProfile?.photoURL ? (
          <Image source={{ uri: userProfile.photoURL }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarFallback}>
            <AppText style={styles.avatarText}>{getUserInitials()}</AppText>
          </View>
        )}
        <View style={styles.profileInfo}>
          <AppText variant="body" style={styles.userName} numberOfLines={1}>
            {userProfile?.fullName || 'User'}
          </AppText>
          <AppText variant="small" style={styles.userEmail} numberOfLines={1}>
            {userProfile?.email || ''}
          </AppText>
        </View>
      </View>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Primary Menu Items */}
      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        {primaryItems.map((item) => {
          const isActive = activeRouteName === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => handleNavigate(item.route)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: isActive }}
            >
              {isActive && <View style={styles.activeIndicator} />}
              <MaterialIcons
                name={item.icon}
                size={22}
                color={isActive ? theme.colors.drawerAccent : theme.colors.drawerTextMuted}
                style={styles.menuItemIcon}
              />
              <AppText
                style={[
                  styles.menuItemLabel,
                  isActive && styles.menuItemLabelActive,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </AppText>
            </TouchableOpacity>
          );
        })}

        {/* Secondary Items Divider */}
        {secondaryItems.length > 0 && <View style={styles.sectionDivider} />}

        {/* Secondary Menu Items */}
        {secondaryItems.map((item) => {
          const isActive = activeRouteName === item.route;
          return (
            <TouchableOpacity
              key={item.route}
              style={[styles.menuItem, isActive && styles.menuItemActive]}
              onPress={() => handleNavigate(item.route)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              accessibilityState={{ selected: isActive }}
            >
              {isActive && <View style={styles.activeIndicator} />}
              <MaterialIcons
                name={item.icon}
                size={22}
                color={isActive ? theme.colors.drawerAccent : theme.colors.drawerTextMuted}
                style={styles.menuItemIcon}
              />
              <AppText
                style={[
                  styles.menuItemLabel,
                  isActive && styles.menuItemLabelActive,
                ]}
                numberOfLines={1}
              >
                {item.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bottom Section: Logout */}
      <View style={styles.bottomSection}>
        <View style={styles.divider} />
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Logout"
        >
          <MaterialIcons
            name="logout"
            size={22}
            color={theme.colors.danger}
            style={styles.menuItemIcon}
          />
          <AppText style={styles.logoutText}>Logout</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.drawerBackground,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.colors.drawerAccent,
  },
  avatarFallback: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.drawerSurface,
    borderWidth: 2,
    borderColor: theme.colors.drawerAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: theme.colors.drawerAccent,
    fontSize: 18,
    fontWeight: '700',
  },
  profileInfo: {
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
  userName: {
    color: theme.colors.drawerText,
    fontWeight: '600',
    fontSize: 15,
  },
  userEmail: {
    color: theme.colors.drawerTextMuted,
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.drawerDivider,
    marginHorizontal: theme.spacing.md,
  },
  menuContainer: {
    flex: 1,
    paddingTop: theme.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    marginVertical: 2,
    borderRadius: theme.radius.sm,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: theme.colors.drawerActiveBackground,
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    top: 8,
    bottom: 8,
    width: 3,
    backgroundColor: theme.colors.drawerActiveBorder,
    borderRadius: 2,
  },
  menuItemIcon: {
    marginRight: theme.spacing.sm,
  },
  menuItemLabel: {
    color: theme.colors.drawerTextMuted,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  menuItemLabelActive: {
    color: theme.colors.drawerText,
    fontWeight: '600',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: theme.colors.drawerDivider,
    marginHorizontal: theme.spacing.lg,
    marginVertical: theme.spacing.sm,
  },
  bottomSection: {
    paddingBottom: theme.spacing.lg,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    marginTop: theme.spacing.sm,
    borderRadius: theme.radius.sm,
  },
  logoutText: {
    color: theme.colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default CustomDrawerContent;

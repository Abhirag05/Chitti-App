import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppText from '@components/ui/AppText';
import AppCard from '@components/ui/AppCard';
import AppHeader from '@components/layout/AppHeader';
import { useAuth } from '@context/AuthContext';
import { AppDrawerParamList } from '@src/types/navigation';
import theme from '@theme';

type Props = {
  navigation: DrawerNavigationProp<AppDrawerParamList, 'Dashboard'>;
};

/**
 * Quick stat card data
 */
interface StatCard {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  color: string;
}

/**
 * Placeholder stats for dashboard
 */
const PLACEHOLDER_STATS: StatCard[] = [
  { label: 'Total Borrowers', value: '0', icon: 'people', color: theme.colors.accent },
  { label: 'Due Today', value: '0', icon: 'today', color: theme.colors.warning },
  { label: 'Overdue', value: '0', icon: 'warning', color: theme.colors.danger },
  { label: 'Upcoming', value: '0', icon: 'event', color: theme.colors.success },
];

/**
 * DashboardScreen - Main overview screen with summary stats
 */
const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { userProfile } = useAuth();

  return (
    <View style={styles.flex}>
      <AppHeader
        title="Dashboard"
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScreenContainer style={styles.container}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <AppText variant="h2" style={styles.greeting}>
            Welcome back,
          </AppText>
          <AppText variant="h1" style={styles.userName}>
            {userProfile?.fullName || 'User'}
          </AppText>
          <AppText variant="small" style={styles.subtitle}>
            Here's your lending overview
          </AppText>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {PLACEHOLDER_STATS.map((stat) =>
            React.createElement(
              View,
              { key: stat.label, style: styles.statCardWrapper } as any,
              React.createElement(
                AppCard,
                { style: styles.statCardInner },
                React.createElement(
                  View,
                  {
                    style: [styles.statIconContainer, { backgroundColor: `${stat.color}15` }],
                  },
                  React.createElement(MaterialIcons, { name: stat.icon, size: 24, color: stat.color })
                ),
                React.createElement(AppText, { variant: 'h2', style: styles.statValue }, stat.value),
                React.createElement(AppText, { variant: 'small', style: styles.statLabel }, stat.label)
              )
            )
          )}
        </View>

        {/* Placeholder Activity Section */}
        <View style={styles.activitySection}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Recent Activity
          </AppText>
          <AppCard style={styles.emptyActivity}>
            <MaterialIcons name="history" size={40} color={theme.colors.muted} />
            <AppText variant="body" style={styles.emptyText}>
              No recent activity
            </AppText>
            <AppText variant="small" style={styles.emptySubtext}>
              Your lending activity will appear here
            </AppText>
          </AppCard>
        </View>
      </ScreenContainer>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    padding: theme.spacing.md,
  },
  welcomeSection: {
    marginBottom: theme.spacing.lg,
  },
  greeting: {
    color: theme.colors.muted,
    fontWeight: '400',
  },
  userName: {
    marginTop: theme.spacing.xxs,
  },
  subtitle: {
    color: theme.colors.muted,
    marginTop: theme.spacing.xxs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xxs,
    marginBottom: theme.spacing.lg,
  },
  statCardWrapper: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: theme.spacing.sm,
  },
  statCardInner: {
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
  },
  statIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    marginBottom: theme.spacing.xxs,
  },
  statLabel: {
    color: theme.colors.muted,
    textAlign: 'center',
  },
  activitySection: {
    flex: 1,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
  emptyActivity: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
  },
  emptyText: {
    marginTop: theme.spacing.sm,
    color: theme.colors.muted,
  },
  emptySubtext: {
    marginTop: theme.spacing.xxs,
    color: theme.colors.muted,
  },
});

export default DashboardScreen;

import React, { useCallback, useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppText from '@components/ui/AppText';
import AppHeader from '@components/layout/AppHeader';
import AppLoader from '@components/ui/AppLoader';
import EmptyState from '@components/ui/EmptyState';
import { StatCard } from '@components/dashboard';
import { InstallmentListItem } from '@components/installments';
import { useAuth } from '@context/AuthContext';
import trackingService from '@services/trackingService';
import { AppDrawerParamList } from '@src/types/navigation';
import { DashboardStats } from '@src/models';
import theme from '@theme';

type Props = {
  navigation: DrawerNavigationProp<AppDrawerParamList, 'Dashboard'>;
};

const formatCurrency = (value: number): string => `₹ ${value.toFixed(2)}`;

/**
 * DashboardScreen - lending overview with real-time aggregated stats
 */
const DashboardScreen: React.FC<Props> = ({ navigation }) => {
  const { user, userProfile } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    if (!user?.uid) {
      setStats(null);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const response = await trackingService.getDashboardStats(user.uid);
      setStats(response);
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
      setStats(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadDashboard();
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      void loadDashboard();
    }, [user?.uid])
  );

  if (loading) {
    return <AppLoader />;
  }

  if (!stats) {
    return (
      <View style={styles.flex}>
        <AppHeader title="Dashboard" onMenuPress={() => navigation.openDrawer()} />
        <ScreenContainer style={styles.centerContent}>
          <EmptyState title="Dashboard unavailable" subtitle="Please pull to refresh or try again." />
        </ScreenContainer>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <AppHeader title="Dashboard" onMenuPress={() => navigation.openDrawer()} />
      <ScreenContainer style={styles.container}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                void loadDashboard();
              }}
            />
          }
          showsVerticalScrollIndicator={false}
        >
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

        <View style={styles.statsGrid}>
          <StatCard label="Active Loans" value={String(stats.totalActiveLoans)} icon="payments" tint={theme.colors.accent} />
          <StatCard label="Outstanding" value={formatCurrency(stats.totalOutstandingAmount)} icon="account-balance-wallet" tint={theme.colors.warning} />
          <StatCard label="Due Today" value={String(stats.dueTodayCount)} icon="today" tint={theme.colors.warning} />
          <StatCard label="Overdue" value={String(stats.overdueCount)} icon="warning" tint={theme.colors.danger} />
          <StatCard label="Completed" value={String(stats.completedLoansCount)} icon="check-circle" tint={theme.colors.success} />
        </View>

        <View style={styles.activitySection}>
          <AppText variant="h3" style={styles.sectionTitle}>
            Recent Payments
          </AppText>

          {stats.recentPayments.length === 0 ? (
            <EmptyState title="No recent payments" subtitle="Paid installments will appear here." />
          ) : (
            stats.recentPayments.map((installment) =>
              React.createElement(InstallmentListItem, {
                key: installment.id,
                installment,
                variant: 'paid',
              } as any)
            )
          )}
        </View>
        </ScrollView>
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
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
    justifyContent: 'space-between',
    marginBottom: theme.spacing.lg,
  },
  activitySection: {
    flex: 1,
    paddingBottom: theme.spacing.xl,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
});

export default DashboardScreen;

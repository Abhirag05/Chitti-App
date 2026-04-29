import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppHeader from '@components/layout/AppHeader';
import AppLoader from '@components/ui/AppLoader';
import EmptyState from '@components/ui/EmptyState';
import { InstallmentListItem } from '@components/installments';
import { useAuth } from '@context/AuthContext';
import loanService from '@services/loanService';
import trackingService from '@services/trackingService';
import { InstallmentTrackingItem } from '@src/models';
import { AppDrawerParamList } from '@src/types/navigation';
import theme from '@theme';

type Props = {
  navigation: DrawerNavigationProp<AppDrawerParamList, 'DueToday'>;
};

const DueTodayScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [installments, setInstallments] = useState<InstallmentTrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const loadInstallments = async () => {
    if (!user?.uid) {
      setInstallments([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const response = await trackingService.getDueTodayInstallments(user.uid);
      setInstallments(response);
    } catch (error) {
      console.error('Failed to load due today installments:', error);
      setInstallments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadInstallments();
  }, [user?.uid]);

  useFocusEffect(
    useCallback(() => {
      void loadInstallments();
    }, [user?.uid])
  );

  const handleMarkPaid = async (item: InstallmentTrackingItem) => {
    if (!user?.uid) {
      return;
    }

    try {
      setMarkingId(item.id);
      await loanService.markInstallmentAsPaid(user.uid, item.loanId, item.id);
      setInstallments((prev) => prev.filter((installment) => installment.id !== item.id));
    } catch (error) {
      console.error('Failed to mark installment as paid:', error);
    } finally {
      setMarkingId(null);
      void loadInstallments();
    }
  };

  if (loading) {
    return <AppLoader />;
  }

  return (
    <View style={styles.flex}>
      <AppHeader title="Due Today" onMenuPress={() => navigation.openDrawer()} />
      <ScreenContainer style={styles.container}>
        <FlatList
          data={installments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <InstallmentListItem
              installment={item}
              variant="dueToday"
              loading={markingId === item.id}
              onMarkPaid={() => handleMarkPaid(item)}
            />
          )}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                void loadInstallments();
              }}
            />
          }
          ListEmptyComponent={
            <EmptyState
              title="No payments due today"
              subtitle="Today's unpaid installments will appear here."
            />
          }
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
    paddingTop: theme.spacing.md,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
});

export default DueTodayScreen;

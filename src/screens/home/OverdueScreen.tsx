import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppHeader from '@components/layout/AppHeader';
import AppLoader from '@components/ui/AppLoader';
import EmptyState from '@components/ui/EmptyState';
import ErrorState from '@components/ui/ErrorState';
import { InstallmentListItem } from '@components/installments';
import { useAuth } from '@context/AuthContext';
import errorHandler from '@services/errorHandler';
import loanService from '@services/loanService';
import trackingService from '@services/trackingService';
import { InstallmentTrackingItem } from '@src/models';
import { AppDrawerParamList } from '@src/types/navigation';
import theme from '@theme';

type Props = {
  navigation: DrawerNavigationProp<AppDrawerParamList, 'Overdue'>;
};

const OverdueScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [installments, setInstallments] = useState<InstallmentTrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const loadInstallments = async () => {
    if (!user?.uid) {
      setInstallments([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const response = await trackingService.getOverdueInstallments(user.uid);
      setInstallments(response);
      setLoadError(null);
    } catch (error) {
      errorHandler.log(error, 'OverdueScreen.loadInstallments');
      setLoadError(errorHandler.format(error));
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

  if (loadError) {
    return (
      <View style={styles.flex}>
        <AppHeader title="Overdue" onMenuPress={() => navigation.openDrawer()} />
        <ScreenContainer style={styles.container}>
          <ErrorState title="Unable to load overdue installments" message={loadError} onRetry={() => void loadInstallments()} />
        </ScreenContainer>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <AppHeader title="Overdue" onMenuPress={() => navigation.openDrawer()} />
      <ScreenContainer style={styles.container}>
        <FlatList
          data={installments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <InstallmentListItem
              installment={item}
              variant="overdue"
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
              title="No overdue payments"
              subtitle="Great work. All overdue installments are cleared."
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

export default OverdueScreen;

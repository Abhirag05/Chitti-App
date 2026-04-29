import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, TouchableOpacity, View } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useFocusEffect } from '@react-navigation/native';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppText from '@components/ui/AppText';
import AppHeader from '@components/layout/AppHeader';
import AppLoader from '@components/ui/AppLoader';
import EmptyState from '@components/ui/EmptyState';
import ErrorState from '@components/ui/ErrorState';
import { DatePickerField } from '@components/forms';
import { InstallmentListItem } from '@components/installments';
import { useAuth } from '@context/AuthContext';
import errorHandler from '@services/errorHandler';
import trackingService from '@services/trackingService';
import { InstallmentTrackingItem } from '@src/models';
import { AppDrawerParamList } from '@src/types/navigation';
import { createDateRange } from '@src/utils/dateHelpers';
import theme from '@theme';

type Props = {
  navigation: DrawerNavigationProp<AppDrawerParamList, 'Upcoming'>;
};

type FilterOption = 'tomorrow' | 'next7' | 'next30' | 'custom';

const FILTER_LABELS: { key: FilterOption; label: string }[] = [
  { key: 'tomorrow', label: 'Tomorrow' },
  { key: 'next7', label: 'Next 7 Days' },
  { key: 'next30', label: 'Next 30 Days' },
  { key: 'custom', label: 'Custom' },
];

const UpcomingScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [filter, setFilter] = useState<FilterOption>('next7');
  const [installments, setInstallments] = useState<InstallmentTrackingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [customStart, setCustomStart] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000));
  const [customEnd, setCustomEnd] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [loadError, setLoadError] = useState<string | null>(null);

  const activeRange = useMemo(() => {
    if (filter === 'tomorrow') {
      return trackingService.getTomorrowRange();
    }

    if (filter === 'next30') {
      return trackingService.getNextDaysRange(30);
    }

    if (filter === 'custom') {
      return createDateRange(customStart, customEnd);
    }

    return trackingService.getNextDaysRange(7);
  }, [customEnd, customStart, filter]);

  const loadInstallments = async () => {
    if (!user?.uid) {
      setInstallments([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const response = await trackingService.getUpcomingInstallments(user.uid, activeRange);
      setInstallments(response);
      setLoadError(null);
    } catch (error) {
      errorHandler.log(error, 'UpcomingScreen.loadInstallments');
      setLoadError(errorHandler.format(error));
      setInstallments([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadInstallments();
  }, [activeRange.endDate, activeRange.startDate, user?.uid]);

  useFocusEffect(
    useCallback(() => {
      void loadInstallments();
    }, [activeRange.endDate, activeRange.startDate, user?.uid])
  );

  if (loading) {
    return <AppLoader />;
  }

  if (loadError) {
    return (
      <View style={styles.flex}>
        <AppHeader title="Upcoming" onMenuPress={() => navigation.openDrawer()} />
        <ScreenContainer style={styles.container}>
          <ErrorState title="Unable to load upcoming installments" message={loadError} onRetry={() => void loadInstallments()} />
        </ScreenContainer>
      </View>
    );
  }

  return (
    <View style={styles.flex}>
      <AppHeader title="Upcoming" onMenuPress={() => navigation.openDrawer()} />
      <ScreenContainer style={styles.container}>
        <View style={styles.filtersRow}>
          {FILTER_LABELS.map((option) => {
            const selected = option.key === filter;
            return (
              <TouchableOpacity
                key={option.key}
                style={[styles.filterChip, selected && styles.filterChipSelected]}
                onPress={() => setFilter(option.key)}
                accessibilityRole="button"
              >
                <AppText variant="small" style={[styles.filterText, selected && styles.filterTextSelected]}>
                  {option.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {filter === 'custom' ? (
          <View style={styles.customRangeWrap}>
            <DatePickerField
              label="From"
              value={customStart}
              onChange={setCustomStart}
              minimumDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
            />
            <DatePickerField
              label="To"
              value={customEnd}
              onChange={setCustomEnd}
              minimumDate={customStart}
            />
          </View>
        ) : null}

        <FlatList
          data={installments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <InstallmentListItem installment={item} variant="upcoming" />}
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
              title="No upcoming payments"
              subtitle="Future installments for this date range will appear here."
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
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  filterChipSelected: {
    borderColor: theme.colors.accent,
    backgroundColor: `${theme.colors.accent}15`,
  },
  filterText: {
    color: theme.colors.muted,
    fontWeight: '600',
  },
  filterTextSelected: {
    color: theme.colors.accent,
  },
  customRangeWrap: {
    marginBottom: theme.spacing.sm,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
});

export default UpcomingScreen;

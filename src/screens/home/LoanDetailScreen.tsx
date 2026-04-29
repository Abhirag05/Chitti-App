import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppHeader from '@components/layout/AppHeader';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppText from '@components/ui/AppText';
import AppCard from '@components/ui/AppCard';
import AppLoader from '@components/ui/AppLoader';
import EmptyState from '@components/ui/EmptyState';
import { InstallmentItem } from '@components/installments';
import { useAuth } from '@context/AuthContext';
import loanService from '@services/loanService';
import { BorrowersStackParamList } from '@src/types/navigation';
import { LoanDetailView } from '@src/models';
import theme from '@theme';

type Props = NativeStackScreenProps<BorrowersStackParamList, 'LoanDetails'>;

const formatCurrency = (value: number): string => `₹ ${value.toFixed(2)}`;
const formatDate = (value: number): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

const LoanDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useAuth();
  const [details, setDetails] = useState<LoanDetailView | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const loadLoan = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      const response = await loanService.getLoanDetail(user.uid, route.params.loanId);
      setDetails(response);
    } catch (error) {
      console.error('Failed to load loan details:', error);
      setDetails(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    void loadLoan();
  }, [route.params.loanId, user?.uid]);

  const handleMarkPaid = async (installmentId: string) => {
    if (!user?.uid || !details) {
      return;
    }

    try {
      setMarkingId(installmentId);
      const response = await loanService.markInstallmentAsPaid(user.uid, details.loan.id, installmentId);
      if (response) {
        setDetails(response);
      }
    } catch (error) {
      console.error('Failed to mark installment as paid:', error);
    } finally {
      setMarkingId(null);
    }
  };

  if (loading) {
    return <AppLoader />;
  }

  return (
    <View style={styles.flex}>
      <AppHeader
        title="Loan Details"
        showMenuToggle
        leftIcon="arrow-back"
        leftAccessibilityLabel="Go back"
        onLeftPress={() => navigation.goBack()}
      />
      <ScreenContainer style={styles.container}>
        {details ? (
          <FlatList
            data={details.installments}
            keyExtractor={(item) => item.id}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); void loadLoan(); }} />}
            ListHeaderComponent={
              <View>
                <AppCard style={styles.loanCard}>
                  <AppText variant="h2">{details.loan.borrowerName}</AppText>
                  <View style={styles.summaryGrid}>
                    <Summary label="Principal" value={formatCurrency(details.loan.principalAmount)} />
                    <Summary label="Repayable" value={formatCurrency(details.loan.totalRepayableAmount)} />
                    <Summary label="Profit" value={formatCurrency(details.loan.profitAmount)} />
                    <Summary label="Weekly" value={formatCurrency(details.loan.weeklyInstallment)} />
                    <Summary label="Weeks" value={String(details.loan.numberOfWeeks)} />
                    <Summary label="Completed" value={String(details.loan.completedWeeks)} />
                    <Summary label="Pending" value={String(details.loan.pendingWeeks)} />
                    <Summary label="Overdue" value={String(details.loan.overdueWeeks)} />
                  </View>

                  <View style={styles.statusRow}>
                    <AppText variant="small" style={styles.statusLabel}>
                      Status
                    </AppText>
                    <AppText variant="body" style={styles.statusValue}>
                      {details.loan.status}
                    </AppText>
                  </View>

                  <View style={styles.datesRow}>
                    <AppText variant="small" style={styles.dateText}>
                      Start: {formatDate(details.loan.startDate)}
                    </AppText>
                    <AppText variant="small" style={styles.dateText}>
                      First due: {formatDate(details.loan.firstDueDate)}
                    </AppText>
                  </View>
                </AppCard>

                <AppText variant="h3" style={styles.sectionTitle}>
                  Installments
                </AppText>
              </View>
            }
            renderItem={({ item }) => (
              <InstallmentItem
                installment={item}
                loading={markingId === item.id}
                onMarkPaid={() => handleMarkPaid(item.id)}
              />
            )}
            ListEmptyComponent={<EmptyState title="No installments" subtitle="Installments will appear here once created." />}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <EmptyState title="Loan not found" subtitle="The requested loan could not be loaded." />
        )}
      </ScreenContainer>
    </View>
  );
};

const Summary: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={styles.summaryItem}>
    <AppText variant="small" style={styles.summaryLabel}>
      {label}
    </AppText>
    <AppText variant="body" style={styles.summaryValue}>
      {value}
    </AppText>
  </View>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    paddingTop: theme.spacing.md,
  },
  loanCard: {
    marginBottom: theme.spacing.md,
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  summaryItem: {
    width: '48%',
  },
  summaryLabel: {
    color: theme.colors.muted,
  },
  summaryValue: {
    marginTop: theme.spacing.xxs,
    fontWeight: '600',
  },
  statusRow: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusLabel: {
    color: theme.colors.muted,
  },
  statusValue: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  datesRow: {
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xxs,
  },
  dateText: {
    color: theme.colors.muted,
  },
  sectionTitle: {
    marginBottom: theme.spacing.sm,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
});

export default LoanDetailScreen;

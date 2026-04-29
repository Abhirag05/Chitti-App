import React, { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppHeader from '@components/layout/AppHeader';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppText from '@components/ui/AppText';
import AppCard from '@components/ui/AppCard';
import AppLoader from '@components/ui/AppLoader';
import EmptyState from '@components/ui/EmptyState';
import { LoanCard } from '@components/loans';
import { useAuth } from '@context/AuthContext';
import borrowerService from '@services/borrowerService';
import loanService from '@services/loanService';
import { BorrowersStackParamList } from '@src/types/navigation';
import { Borrower, LoanWithProgress } from '@src/models';
import theme from '@theme';

type Props = NativeStackScreenProps<BorrowersStackParamList, 'BorrowerDetails'>;

const formatCurrency = (value: number): string => `₹ ${value.toFixed(2)}`;

const BorrowerDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useAuth();
  const [borrower, setBorrower] = useState<Borrower | null>(null);
  const [loans, setLoans] = useState<LoanWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }

    try {
      const borrowerData = await borrowerService.getBorrowerById(user.uid, route.params.borrowerId);

      setBorrower(borrowerData);

      if (borrowerData) {
        const loanItems = await loanService.getLoansByBorrower(user.uid, borrowerData.id);
        setLoans(loanItems);
      } else {
        setLoans([]);
      }
    } catch (error) {
      console.error('Failed to load borrower details:', error);
      setBorrower(null);
      setLoans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [route.params.borrowerId, user?.uid]);

  const totalOutstanding = useMemo(
    () => loans.reduce((total, loan) => total + loan.outstandingAmount, 0),
    [loans]
  );

  if (loading) {
    return <AppLoader />;
  }

  return (
    <View style={styles.flex}>
      <AppHeader
        title="Borrower Details"
        showMenuToggle
        leftIcon="arrow-back"
        leftAccessibilityLabel="Go back"
        onLeftPress={() => navigation.goBack()}
      />
      <ScreenContainer style={styles.container}>
        {borrower ? (
          <AppCard style={styles.profileCard}>
            <AppText variant="h2">{borrower.fullName}</AppText>
            <AppText variant="body" style={styles.metaText}>
              {borrower.phoneNumber}
            </AppText>
            <AppText variant="body" style={styles.metaText}>
              {borrower.address}
            </AppText>
            {borrower.reference ? (
              <AppText variant="body" style={styles.metaText}>
                Reference: {borrower.reference}
              </AppText>
            ) : null}
          </AppCard>
        ) : null}

        <View style={styles.summaryRow}>
          <AppCard style={styles.summaryCard}>
            <AppText variant="small" style={styles.summaryLabel}>
              Active Loans
            </AppText>
            <AppText variant="h2">{loans.filter((loan) => loan.status === 'active').length}</AppText>
          </AppCard>
          <AppCard style={styles.summaryCard}>
            <AppText variant="small" style={styles.summaryLabel}>
              Outstanding
            </AppText>
            <AppText variant="h2">{formatCurrency(totalOutstanding)}</AppText>
          </AppCard>
        </View>

        {loans.length === 0 ? (
          <EmptyState title="No loans yet" subtitle="This borrower does not have any loans assigned yet." />
        ) : (
          <FlatList
            data={loans}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <LoanCard
                loan={item}
                onPress={() => navigation.navigate('LoanDetails', { loanId: item.id, borrowerId: item.borrowerId })}
              />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  profileCard: {
    marginBottom: theme.spacing.md,
  },
  metaText: {
    color: theme.colors.muted,
    marginTop: theme.spacing.xxs,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  summaryCard: {
    flex: 1,
  },
  summaryLabel: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.xxs,
  },
  listContent: {
    paddingBottom: theme.spacing.xl,
  },
});

export default BorrowerDetailScreen;

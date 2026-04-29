import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppCard from '@components/ui/AppCard';
import AppText from '@components/ui/AppText';
import { LoanWithProgress } from '@src/models';
import theme from '@theme';

type Props = {
  loan: LoanWithProgress;
  onPress: () => void;
};

const formatCurrency = (value: number): string => `₹ ${value.toFixed(2)}`;

const LoanCard: React.FC<Props> = ({ loan, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <AppText variant="h3" numberOfLines={1}>
              {loan.borrowerName}
            </AppText>
            <AppText variant="small" style={styles.subtext}>
              {loan.numberOfWeeks} weeks
            </AppText>
          </View>
          <View style={[styles.statusBadge, loan.overdueWeeks > 0 && styles.statusBadgeWarning]}>
            <AppText variant="small" style={styles.statusText}>
              {loan.overdueWeeks > 0 ? 'Overdue' : loan.status}
            </AppText>
          </View>
        </View>

        <View style={styles.metricsRow}>
          <View style={styles.metricItem}>
            <AppText variant="small" style={styles.metaLabel}>
              Principal
            </AppText>
            <AppText variant="body">{formatCurrency(loan.principalAmount)}</AppText>
          </View>
          <View style={styles.metricItem}>
            <AppText variant="small" style={styles.metaLabel}>
              Repayable
            </AppText>
            <AppText variant="body">{formatCurrency(loan.totalRepayableAmount)}</AppText>
          </View>
        </View>

        <View style={styles.progressRow}>
          <AppText variant="small" style={styles.progressText}>
            {loan.completedWeeks} completed
          </AppText>
          <AppText variant="small" style={styles.progressText}>
            {loan.pendingWeeks} pending
          </AppText>
          <AppText variant="small" style={[styles.progressText, loan.overdueWeeks > 0 && styles.overdueText]}>
            {loan.overdueWeeks} overdue
          </AppText>
        </View>
      </AppCard>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  titleBlock: {
    flex: 1,
  },
  subtext: {
    color: theme.colors.muted,
    marginTop: theme.spacing.xxs,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: 999,
    backgroundColor: '#dcfce7',
  },
  statusBadgeWarning: {
    backgroundColor: '#fee2e2',
  },
  statusText: {
    color: theme.colors.success,
    fontWeight: '600',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  metricItem: {
    flex: 1,
  },
  metaLabel: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.xxs,
  },
  progressRow: {
    marginTop: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  progressText: {
    color: theme.colors.muted,
  },
  overdueText: {
    color: theme.colors.danger,
    fontWeight: '600',
  },
});

export default LoanCard;

import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppCard from '@components/ui/AppCard';
import AppText from '@components/ui/AppText';
import AppButton from '@components/ui/AppButton';
import { InstallmentWithStatus } from '@src/models';
import theme from '@theme';

type Props = {
  installment: InstallmentWithStatus;
  onMarkPaid: () => void;
  loading?: boolean;
};

const formatDate = (value: number): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

const InstallmentItem: React.FC<Props> = ({ installment, onMarkPaid, loading = false }) => {
  const statusColor =
    installment.effectiveStatus === 'paid'
      ? theme.colors.success
      : installment.effectiveStatus === 'overdue'
        ? theme.colors.danger
        : theme.colors.muted;

  return (
    <AppCard style={styles.card}>
      <View style={styles.headerRow}>
        <View>
          <AppText variant="body" style={styles.weekText}>
            Week {installment.weekNumber}
          </AppText>
          <AppText variant="small" style={styles.subtext}>
            Due {formatDate(installment.dueDate)}
          </AppText>
        </View>

        <View style={[styles.statusPill, { backgroundColor: `${statusColor}18` }]}>
          <AppText variant="small" style={[styles.statusText, { color: statusColor }]}>
            {installment.effectiveStatus}
          </AppText>
        </View>
      </View>

      <View style={styles.footerRow}>
        <AppText variant="h3">₹ {installment.amount.toFixed(2)}</AppText>
        {installment.effectiveStatus === 'pending' || installment.effectiveStatus === 'overdue' ? (
          <AppButton title="Mark Paid" onPress={onMarkPaid} loading={loading} style={styles.button} />
        ) : (
          <AppText variant="small" style={styles.paidLabel}>
            Paid on {installment.paidAt ? formatDate(installment.paidAt) : '—'}
          </AppText>
        )}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  weekText: {
    fontWeight: '600',
  },
  subtext: {
    marginTop: theme.spacing.xxs,
    color: theme.colors.muted,
  },
  statusPill: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: 999,
  },
  statusText: {
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  footerRow: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  button: {
    minWidth: 110,
  },
  paidLabel: {
    color: theme.colors.success,
    fontWeight: '600',
  },
});

export default InstallmentItem;

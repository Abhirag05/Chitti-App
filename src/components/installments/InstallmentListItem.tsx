import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppButton from '@components/ui/AppButton';
import AppCard from '@components/ui/AppCard';
import AppText from '@components/ui/AppText';
import { InstallmentTrackingItem } from '@src/models';
import theme from '@theme';

type Variant = 'dueToday' | 'overdue' | 'upcoming' | 'paid';

type Props = {
  installment: InstallmentTrackingItem;
  variant: Variant;
  onMarkPaid?: () => void;
  loading?: boolean;
};

const formatDate = (value: number): string =>
  new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

const formatAmount = (value: number): string => `₹ ${value.toFixed(2)}`;

const getAccentColor = (variant: Variant): string => {
  if (variant === 'overdue') {
    return theme.colors.danger;
  }

  if (variant === 'dueToday') {
    return theme.colors.warning;
  }

  if (variant === 'paid') {
    return theme.colors.success;
  }

  return theme.colors.muted;
};

const InstallmentListItem: React.FC<Props> = ({ installment, variant, onMarkPaid, loading = false }) => {
  const accentColor = getAccentColor(variant);
  const statusText =
    variant === 'overdue'
      ? `${installment.daysOverdue} day${installment.daysOverdue === 1 ? '' : 's'} overdue`
      : variant === 'paid'
        ? 'Paid'
        : variant === 'dueToday'
          ? 'Due today'
          : 'Upcoming';

  return (
    <AppCard style={[styles.card, { borderLeftColor: accentColor }]}>
      <View style={styles.rowTop}>
        <View style={styles.borrowerWrap}>
          <AppText variant="body" style={styles.borrowerName} numberOfLines={1}>
            {installment.borrowerName}
          </AppText>
          <AppText variant="small" style={styles.loanRef}>
            {installment.loanReference}
          </AppText>
        </View>
        <AppText variant="h3">{formatAmount(installment.amount)}</AppText>
      </View>

      <View style={styles.rowBottom}>
        <View>
          <AppText variant="small" style={styles.metaText}>
            Due {formatDate(installment.dueDate)}
          </AppText>
          <AppText variant="small" style={[styles.metaText, { color: accentColor }]}>
            {statusText}
          </AppText>
        </View>

        {onMarkPaid && installment.effectiveStatus !== 'paid' ? (
          <AppButton title="Mark Paid" onPress={onMarkPaid} loading={loading} style={styles.button} />
        ) : null}
      </View>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 4,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  borrowerWrap: {
    flex: 1,
  },
  borrowerName: {
    fontWeight: '600',
  },
  loanRef: {
    marginTop: theme.spacing.xxs,
    color: theme.colors.muted,
  },
  rowBottom: {
    marginTop: theme.spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  metaText: {
    color: theme.colors.muted,
  },
  button: {
    minWidth: 110,
  },
});

export default InstallmentListItem;

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import AppCard from '@components/ui/AppCard';
import AppText from '@components/ui/AppText';
import { BorrowerSummary } from '@src/models';
import theme from '@theme';

type Props = {
  borrower: BorrowerSummary;
  onPress: () => void;
};

const formatCurrency = (value: number): string => `₹ ${value.toFixed(2)}`;

const BorrowerCard: React.FC<Props> = ({ borrower, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <AppCard style={styles.card}>
        <View style={styles.header}>
          <View style={styles.titleBlock}>
            <AppText variant="h3" numberOfLines={1}>
              {borrower.fullName}
            </AppText>
            <AppText variant="small" style={styles.subtext} numberOfLines={1}>
              {borrower.phoneNumber}
            </AppText>
          </View>
          <View style={styles.loanBadge}>
            <AppText variant="small" style={styles.loanBadgeText}>
              {borrower.totalActiveLoansCount} active
            </AppText>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <AppText variant="small" style={styles.metaLabel}>
              Outstanding
            </AppText>
            <AppText variant="body" style={styles.outstandingValue}>
              {formatCurrency(borrower.totalOutstandingAmount)}
            </AppText>
          </View>
          <AppText variant="small" style={styles.chevron}>
            View details
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
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  titleBlock: {
    flex: 1,
  },
  subtext: {
    marginTop: theme.spacing.xxs,
    color: theme.colors.muted,
  },
  loanBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xxs,
    borderRadius: 999,
    backgroundColor: '#ede9fe',
  },
  loanBadgeText: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
  footer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaLabel: {
    color: theme.colors.muted,
  },
  outstandingValue: {
    fontWeight: '700',
    marginTop: theme.spacing.xxs,
  },
  chevron: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
});

export default BorrowerCard;

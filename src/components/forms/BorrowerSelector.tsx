import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AppCard from '@components/ui/AppCard';
import AppText from '@components/ui/AppText';
import { Borrower } from '@src/models';
import theme from '@theme';

type Props = {
  borrowers: Borrower[];
  selectedBorrowerId: string;
  onSelectBorrower: (borrower: Borrower) => void;
  loading?: boolean;
  message?: string;
};

const BorrowerSelector: React.FC<Props> = ({
  borrowers,
  selectedBorrowerId,
  onSelectBorrower,
  loading = false,
  message,
}) => {
  const [expanded, setExpanded] = useState(false);

  const selectedBorrower = useMemo(
    () => borrowers.find((borrower) => borrower.id === selectedBorrowerId) ?? null,
    [borrowers, selectedBorrowerId]
  );

  const renderBorrower = ({ item }: { item: Borrower }) => {
    const isSelected = item.id === selectedBorrowerId;

    return (
      <Pressable
        style={[styles.option, isSelected && styles.optionSelected]}
        onPress={() => {
          onSelectBorrower(item);
          setExpanded(false);
        }}
      >
        <View style={styles.optionText}>
          <AppText variant="body" style={styles.optionName} numberOfLines={1}>
            {item.fullName}
          </AppText>
          <AppText variant="small" style={styles.optionMeta} numberOfLines={1}>
            {item.phoneNumber}
          </AppText>
        </View>
        {isSelected ? <MaterialIcons name="check-circle" size={20} color={theme.colors.success} /> : null}
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.selector} onPress={() => setExpanded((value) => !value)}>
        <View style={styles.selectorText}>
          <AppText variant="body" style={styles.selectorLabel}>
            {selectedBorrower ? selectedBorrower.fullName : 'Select Borrower'}
          </AppText>
          <AppText variant="small" style={styles.selectorMeta}>
            {selectedBorrower ? selectedBorrower.phoneNumber : 'Choose an existing borrower'}
          </AppText>
        </View>
        <MaterialIcons
          name={expanded ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
          size={24}
          color={theme.colors.muted}
        />
      </Pressable>

      {message ? (
        <AppText variant="small" style={styles.message}>
          {message}
        </AppText>
      ) : null}

      {selectedBorrower ? (
        <AppCard style={styles.selectedCard}>
          <AppText variant="small" style={styles.selectedLabel}>
            Selected Borrower
          </AppText>
          <AppText variant="body" style={styles.selectedName}>
            {selectedBorrower.fullName}
          </AppText>
          <AppText variant="small" style={styles.selectedMeta}>
            {selectedBorrower.phoneNumber}
          </AppText>
          <AppText variant="small" style={styles.selectedMeta}>
            {selectedBorrower.address}
          </AppText>
          {selectedBorrower.reference ? (
            <AppText variant="small" style={styles.selectedMeta}>
              Ref: {selectedBorrower.reference}
            </AppText>
          ) : null}
        </AppCard>
      ) : null}

      {expanded ? (
        <AppCard style={styles.dropdownCard}>
          {loading ? (
            <AppText variant="small" style={styles.loadingText}>
              Loading borrowers...
            </AppText>
          ) : borrowers.length === 0 ? (
            <AppText variant="small" style={styles.loadingText}>
              No borrowers found yet.
            </AppText>
          ) : (
            <FlatList
              data={borrowers}
              keyExtractor={(item) => item.id}
              renderItem={renderBorrower}
              scrollEnabled={false}
            />
          )}
        </AppCard>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  selector: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: theme.radius.sm,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectorText: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  selectorLabel: {
    fontWeight: '600',
  },
  selectorMeta: {
    color: theme.colors.muted,
    marginTop: 2,
  },
  message: {
    marginTop: theme.spacing.xxs,
    color: theme.colors.success,
  },
  selectedCard: {
    marginTop: theme.spacing.sm,
    backgroundColor: '#eff6ff',
  },
  selectedLabel: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.xxs,
  },
  selectedName: {
    fontWeight: '600',
    marginBottom: theme.spacing.xxs,
  },
  selectedMeta: {
    color: theme.colors.muted,
    marginTop: 2,
  },
  dropdownCard: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    maxHeight: 320,
  },
  loadingText: {
    color: theme.colors.muted,
  },
  option: {
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionSelected: {
    backgroundColor: '#f8fafc',
  },
  optionText: {
    flex: 1,
    paddingRight: theme.spacing.sm,
  },
  optionName: {
    fontWeight: '600',
  },
  optionMeta: {
    color: theme.colors.muted,
    marginTop: 2,
  },
});

export default BorrowerSelector;

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { MaterialIcons } from '@expo/vector-icons';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppText from '@components/ui/AppText';
import AppCard from '@components/ui/AppCard';
import AppHeader from '@components/layout/AppHeader';
import { AppDrawerParamList } from '@src/types/navigation';
import theme from '@theme';

type Props = {
  navigation: DrawerNavigationProp<AppDrawerParamList, 'AddBorrower'>;
};

/**
 * AddBorrowerScreen - Add a new borrower (placeholder)
 */
const AddBorrowerScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.flex}>
      <AppHeader
        title="Add Borrower"
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScreenContainer style={styles.container}>
        <AppCard style={styles.emptyCard}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="person-add" size={48} color={theme.colors.accent} />
          </View>
          <AppText variant="h2" style={styles.emptyTitle}>
            Add New Borrower
          </AppText>
          <AppText variant="body" style={styles.emptySubtext}>
            The borrower registration form will be available here in the next update.
          </AppText>
        </AppCard>
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
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: `${theme.colors.accent}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  emptyTitle: {
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptySubtext: {
    color: theme.colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default AddBorrowerScreen;

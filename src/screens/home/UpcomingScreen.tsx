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
  navigation: DrawerNavigationProp<AppDrawerParamList, 'Upcoming'>;
};

/**
 * UpcomingScreen - Shows upcoming payments (placeholder)
 */
const UpcomingScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <View style={styles.flex}>
      <AppHeader
        title="Upcoming"
        onMenuPress={() => navigation.openDrawer()}
      />
      <ScreenContainer style={styles.container}>
        <AppCard style={styles.emptyCard}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="event" size={48} color={theme.colors.success} />
          </View>
          <AppText variant="h2" style={styles.emptyTitle}>
            No Upcoming Payments
          </AppText>
          <AppText variant="body" style={styles.emptySubtext}>
            Scheduled future payments will appear here once you set up loans.
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
    backgroundColor: `${theme.colors.success}15`,
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

export default UpcomingScreen;

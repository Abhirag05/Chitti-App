import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import AppCard from '@components/ui/AppCard';
import AppText from '@components/ui/AppText';
import theme from '@theme';

type Props = {
  label: string;
  value: string;
  icon: React.ComponentProps<typeof MaterialIcons>['name'];
  tint: string;
};

const StatCard: React.FC<Props> = ({ label, value, icon, tint }) => {
  return (
    <AppCard style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: `${tint}18` }]}>
        <MaterialIcons name={icon} size={20} color={tint} />
      </View>
      <AppText variant="h2" style={styles.value}>
        {value}
      </AppText>
      <AppText variant="small" style={styles.label}>
        {label}
      </AppText>
    </AppCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    marginBottom: theme.spacing.sm,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  value: {
    marginBottom: theme.spacing.xxs,
  },
  label: {
    color: theme.colors.muted,
  },
});

export default StatCard;

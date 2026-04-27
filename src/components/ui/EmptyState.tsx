import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppText from './AppText';
import theme from '@theme';

type Props = { title?: string; subtitle?: string };

export const EmptyState: React.FC<Props> = ({ title = 'Nothing here', subtitle }) => {
  return (
    <View style={styles.container}>
      <AppText variant="h2">{title}</AppText>
      {subtitle ? <AppText variant="body">{subtitle}</AppText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
});

export default EmptyState;

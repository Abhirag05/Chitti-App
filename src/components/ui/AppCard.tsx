import React from 'react';
import { View, StyleSheet, ViewProps } from 'react-native';
import theme from '@theme';

export const AppCard: React.FC<ViewProps> = ({ children, style, ...rest }) => {
  return (
    <View style={[styles.card, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    ...theme.shadow.sm,
  },
});

export default AppCard;

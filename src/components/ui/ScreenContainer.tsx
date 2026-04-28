import React from 'react';
import { StyleSheet, ViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '@theme';

export const ScreenContainer: React.FC<ViewProps> = ({ children, style, ...rest }) => {
  return (
    <SafeAreaView style={[styles.container, style]} {...rest}>
      {children}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
});

export default ScreenContainer;

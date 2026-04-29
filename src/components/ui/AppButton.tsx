import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps, ActivityIndicator, View } from 'react-native';
import theme from '@theme';
import AppText from './AppText';

type Props = TouchableOpacityProps & { title: string; loading?: boolean };

export const AppButton: React.FC<Props> = ({ title, style, loading = false, disabled, ...rest }) => {
  const isDisabled = loading || disabled;

  return (
    <TouchableOpacity style={[styles.button, isDisabled && styles.buttonDisabled, style]} activeOpacity={0.8} disabled={isDisabled} {...rest}>
      <View style={styles.content}>
        {loading ? <ActivityIndicator color="#fff" size="small" /> : null}
        <AppText style={styles.text}>{title}</AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: theme.colors.accent,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AppButton;

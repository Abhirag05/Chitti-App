import React from 'react';
import { TouchableOpacity, StyleSheet, TouchableOpacityProps } from 'react-native';
import theme from '@theme';
import AppText from './AppText';

type Props = TouchableOpacityProps & { title: string };

export const AppButton: React.FC<Props> = ({ title, style, ...rest }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} activeOpacity={0.8} {...rest}>
      <AppText style={styles.text}>{title}</AppText>
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
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default AppButton;

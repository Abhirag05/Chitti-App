import React, { useState } from 'react';
import { TextInputProps, View, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import AppText from '../ui/AppText';
import theme from '@theme';

type Props = TextInputProps & {
  label?: string;
};

/**
 * PasswordInput - Input field with show/hide password toggle
 */
export const PasswordInput: React.FC<Props> = ({ label = 'Password', ...rest }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={styles.container}>
      <AppText variant="small" style={styles.label}>
        {label}
      </AppText>
      <View style={styles.inputRow}>
        <TextInput
          {...rest}
          secureTextEntry={!showPassword}
          placeholder="Enter your password"
          placeholderTextColor={theme.colors.muted}
          style={styles.input}
        />
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowPassword(!showPassword)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          accessibilityRole="button"
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
        >
          <AppText style={styles.toggleText}>{showPassword ? '👁️' : '👁️‍🗨️'}</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  label: {
    marginBottom: theme.spacing.xxs,
  },
  inputRow: {
    position: 'relative',
  },
  input: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingRight: 48,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    color: theme.colors.text,
  },
  toggleButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 18,
  },
});

export default PasswordInput;

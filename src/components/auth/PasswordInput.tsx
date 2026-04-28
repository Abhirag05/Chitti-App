import React, { useState } from 'react';
import { TextInputProps, View, TouchableOpacity, StyleSheet } from 'react-native';
import AppInput from '../ui/AppInput';
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
      <AppInput
        {...rest}
        label={label}
        secureTextEntry={!showPassword}
        placeholder="Enter your password"
      />
      <TouchableOpacity
        style={styles.toggleButton}
        onPress={() => setShowPassword(!showPassword)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <AppText style={styles.toggleText}>
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  toggleButton: {
    position: 'absolute',
    right: theme.spacing.md,
    top: '50%',
    marginTop: theme.spacing.sm,
  },
  toggleText: {
    fontSize: 18,
  },
});

export default PasswordInput;

import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native';
import theme from '@theme';
import AppText from './AppText';

type Props = TextInputProps & { label?: string };

export const AppInput: React.FC<Props> = ({ label, style, ...rest }) => {
  return (
    <View>
      {label ? <AppText variant="small">{label}</AppText> : null}
      <TextInput style={[styles.input, style]} placeholderTextColor={theme.colors.muted} {...rest} />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});

export default AppInput;

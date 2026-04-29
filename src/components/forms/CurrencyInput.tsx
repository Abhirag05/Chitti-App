import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppInput from '@components/ui/AppInput';
import AppText from '@components/ui/AppText';
import theme from '@theme';

type Props = {
  label?: string;
  value: string;
  onChangeValue: (value: string) => void;
  placeholder?: string;
  error?: string;
  editable?: boolean;
};

const CurrencyInput: React.FC<Props> = ({
  label,
  value,
  onChangeValue,
  placeholder = '0',
  error,
  editable = true,
}) => {
  return (
    <View style={styles.container}>
      <AppInput
        label={label}
        value={value}
        placeholder={placeholder}
        keyboardType="decimal-pad"
        onChangeText={(text) => onChangeValue(text.replace(/[^0-9.]/g, ''))}
        editable={editable}
      />
      {error ? <AppText variant="small" style={styles.error}>{error}</AppText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  error: {
    marginTop: theme.spacing.xxs,
    color: theme.colors.danger,
  },
});

export default CurrencyInput;

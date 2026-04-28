import React from 'react';
import { Text, TextProps, StyleSheet, TextStyle } from 'react-native';
import theme from '@theme';

type Props = TextProps & { variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small' };

export const AppText: React.FC<Props> = ({ variant = 'body', style, children, ...rest }) => {
  const variantStyle = theme.typography[variant] as unknown as TextStyle;
  return (
    <Text style={[styles.text, variantStyle, style]} {...rest}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: theme.colors.text,
  },
});

export default AppText;

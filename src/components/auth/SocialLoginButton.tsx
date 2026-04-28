import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, View } from 'react-native';
import theme from '@theme';
import AppText from '../ui/AppText';

type Props = {
  title: string;
  icon?: string;
  loading?: boolean;
  onPress: () => void;
  style?: any;
};

/**
 * SocialLoginButton - Reusable button for social login (Google, etc.)
 */
export const SocialLoginButton: React.FC<Props> = ({
  title,
  icon,
  loading = false,
  onPress,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator color={theme.colors.primary} size="small" />
        ) : icon ? (
          <AppText style={styles.icon}>{icon}</AppText>
        ) : null}
        <AppText style={styles.text}>{title}</AppText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: theme.colors.border || '#e5e7eb',
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  icon: {
    fontSize: 20,
  },
  text: {
    color: theme.colors.text,
    fontWeight: '600',
  },
});

export default SocialLoginButton;

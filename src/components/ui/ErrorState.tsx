import React from 'react';
import { StyleSheet, View } from 'react-native';
import AppCard from './AppCard';
import AppButton from './AppButton';
import AppText from './AppText';
import theme from '@theme';

type Props = {
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry?: () => void;
};

const ErrorState: React.FC<Props> = ({
  title = 'Something went wrong',
  message = 'Please try again.',
  retryLabel = 'Retry',
  onRetry,
}) => {
  return (
    <View style={styles.container}>
      <AppCard style={styles.card}>
        <AppText variant="h3" style={styles.title}>
          {title}
        </AppText>
        <AppText variant="body" style={styles.message}>
          {message}
        </AppText>
        {onRetry ? <AppButton title={retryLabel} onPress={onRetry} style={styles.button} /> : null}
      </AppCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
  },
  card: {
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
  },
  message: {
    color: theme.colors.muted,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  button: {
    minWidth: 120,
  },
});

export default ErrorState;

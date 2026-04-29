import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import AppText from '@components/ui/AppText';
import AppButton from '@components/ui/AppButton';
import theme from '@theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - Catches runtime errors in production and displays a friendly message
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <AppText variant="h1" style={styles.title}>
              Oops!
            </AppText>
            <AppText variant="body" style={styles.subtitle}>
              An unexpected error occurred and the app crashed.
            </AppText>
            
            <View style={styles.errorBox}>
              <AppText style={styles.errorLabel}>Technical Details:</AppText>
              <AppText style={styles.errorText}>
                {this.state.error?.message || 'Unknown error'}
              </AppText>
            </View>

            <AppButton 
              title="Try Again" 
              onPress={this.handleReset}
              style={styles.button}
            />
          </ScrollView>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  title: {
    marginBottom: theme.spacing.sm,
    color: theme.colors.danger,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    color: theme.colors.muted,
  },
  errorBox: {
    width: '100%',
    padding: theme.spacing.md,
    backgroundColor: '#f8fafc',
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: theme.spacing.xl,
  },
  errorLabel: {
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
    fontSize: 12,
    color: theme.colors.muted,
  },
  errorText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: theme.colors.danger,
  },
  button: {
    width: '100%',
  },
});

export default ErrorBoundary;

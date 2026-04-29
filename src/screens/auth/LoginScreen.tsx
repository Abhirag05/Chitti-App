import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppText from '@components/ui/AppText';
import AppInput from '@components/ui/AppInput';
import AppButton from '@components/ui/AppButton';
import AppCard from '@components/ui/AppCard';
import AppLoader from '@components/ui/AppLoader';
import PasswordInput from '@components/auth/PasswordInput';
import { useAuth } from '@context/AuthContext';
import { loginSchema, LoginFormData } from '@utils/validators/authValidators';
import theme from '@theme';

type Props = {
  navigation: any;
};

/**
 * LoginScreen - Email/Password login
 */
const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { login, loading, error, clearError } = useAuth();

  const [authFieldError, setAuthFieldError] = useState<null | 'email' | 'password' | 'general'>(null);
  const [authErrorMessage, setAuthErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  /**
   * Handle email/password login
   */
  const onSubmit = async (data: LoginFormData) => {
    try {
      await login({ email: data.email, password: data.password });
      // Navigation handled by app navigation logic
    } catch (err) {
      // Error is already in context
    }
  };

  useEffect(() => {
    if (!error) {
      return;
    }

    // Map known auth messages to field-level errors for better UX
    const lower = error.toLowerCase();
    if (
      lower.includes('password') ||
      lower.includes('incorrect password') ||
      lower.includes('wrong-password') ||
      lower.includes('invalid credential') ||
      lower.includes('incorrect email or password')
    ) {
      setAuthFieldError('password');
      setAuthErrorMessage(error);
    } else if (lower.includes('user not found') || lower.includes('no user') || lower.includes('invalid email')) {
      setAuthFieldError('email');
      setAuthErrorMessage(error);
    } else {
      // Fallback to alert for other errors
      setAuthFieldError('general');
      setAuthErrorMessage(error);
      Alert.alert('Login Error', error);
    }

    // keep error in context until user acts; clear after mapping
    clearError();
  }, [error, clearError]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenContainer style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <AppText variant="h1" style={styles.title}>
              Welcome Back
            </AppText>
            <AppText variant="body" style={styles.subtitle}>
              Sign in to your account
            </AppText>
          </View>

          {/* Loading State */}
          {loading && <AppLoader />}

          {/* Login Form */}
          {!loading && (
            <AppCard style={styles.form}>
              {/* Email Field */}
              <View style={styles.formGroup}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <AppInput
                      label="Email"
                      placeholder="your@email.com"
                      value={value}
                      onChangeText={(v) => {
                        onChange(v);
                        // clear auth errors when user edits
                        setAuthFieldError(null);
                        setAuthErrorMessage(null);
                        clearError();
                      }}
                      keyboardType="email-address"
                      editable={!loading}
                    />
                  )}
                />
                {errors.email && (
                  <AppText style={styles.error}>{errors.email.message}</AppText>
                )}
                {authFieldError === 'email' && authErrorMessage && (
                  <AppText style={styles.error}>{authErrorMessage}</AppText>
                )}
              </View>

              {/* Password Field */}
              <View style={styles.formGroup}>
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <PasswordInput
                      value={value}
                      onChangeText={(v) => {
                        onChange(v);
                        setAuthFieldError(null);
                        setAuthErrorMessage(null);
                        clearError();
                      }}
                      editable={!loading}
                    />
                  )}
                />
                {errors.password && (
                  <AppText style={styles.error}>{errors.password.message}</AppText>
                )}
                {authFieldError === 'password' && authErrorMessage && (
                  <AppText style={styles.error}>{authErrorMessage}</AppText>
                )}
              </View>

              {/* Forgot Password Link */}
              <TouchableOpacity
                style={styles.forgotPasswordLink}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <AppText style={styles.forgotPasswordText}>Forgot Password?</AppText>
              </TouchableOpacity>

              {/* Login Button */}
              <AppButton
                title={loading ? 'Signing in...' : 'Sign In'}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                style={styles.loginButton}
              />
            </AppCard>
          )}

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <AppText variant="body">Don't have an account? </AppText>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <AppText style={styles.signUpLink}>Sign Up</AppText>
            </TouchableOpacity>
          </View>
        </ScreenContainer>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl,
  },
  header: {
    marginBottom: theme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    marginBottom: theme.spacing.sm,
    fontWeight: 'bold',
  },
  subtitle: {
    color: theme.colors.muted,
  },
  form: {
    marginBottom: theme.spacing.lg,
  },
  formGroup: {
    marginBottom: theme.spacing.lg,
  },
  error: {
    color: theme.colors.error || '#ef4444',
    fontSize: 12,
    marginTop: theme.spacing.xs,
  },
  forgotPasswordLink: {
    marginBottom: theme.spacing.md,
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: theme.colors.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loginButton: {
    marginBottom: theme.spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpLink: {
    color: theme.colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;

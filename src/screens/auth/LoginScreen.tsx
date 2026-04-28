import React, { useEffect } from 'react';
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
    if (error) {
      Alert.alert('Login Error', error);
      clearError();
    }
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
                      onChangeText={onChange}
                      keyboardType="email-address"
                      editable={!loading}
                    />
                  )}
                />
                {errors.email && (
                  <AppText style={styles.error}>{errors.email.message}</AppText>
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
                      onChangeText={onChange}
                      editable={!loading}
                    />
                  )}
                />
                {errors.password && (
                  <AppText style={styles.error}>{errors.password.message}</AppText>
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

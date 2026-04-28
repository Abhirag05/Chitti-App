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
import { registerSchema, RegisterFormData } from '@utils/validators/authValidators';
import theme from '@theme';

type Props = {
  navigation: any;
};

/**
 * RegisterScreen - Email registration with validation
 */
const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { register, loading, error, clearError } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password');

  /**
   * Handle registration
   */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      await register({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
      });
      // Navigation handled by app navigation logic
    } catch (err) {
      // Error is already in context
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Registration Error', error);
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
              Create Account
            </AppText>
            <AppText variant="body" style={styles.subtitle}>
              Join us today
            </AppText>
          </View>

          {/* Loading State */}
          {loading && <AppLoader />}

          {/* Register Form */}
          {!loading && (
            <AppCard style={styles.form}>
              {/* Full Name Field */}
              <View style={styles.formGroup}>
                <Controller
                  control={control}
                  name="fullName"
                  render={({ field: { onChange, value } }) => (
                    <AppInput
                      label="Full Name"
                      placeholder="John Doe"
                      value={value}
                      onChangeText={onChange}
                      editable={!loading}
                    />
                  )}
                />
                {errors.fullName && (
                  <AppText style={styles.error}>{errors.fullName.message}</AppText>
                )}
              </View>

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
                      label="Password"
                      value={value}
                      onChangeText={onChange}
                      editable={!loading}
                    />
                  )}
                />
                {errors.password && (
                  <AppText style={styles.error}>{errors.password.message}</AppText>
                )}
                <AppText style={styles.passwordHint}>
                  • Min 8 characters • 1 uppercase • 1 number
                </AppText>
              </View>

              {/* Confirm Password Field */}
              <View style={styles.formGroup}>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, value } }) => (
                    <PasswordInput
                      label="Confirm Password"
                      value={value}
                      onChangeText={onChange}
                      editable={!loading}
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <AppText style={styles.error}>{errors.confirmPassword.message}</AppText>
                )}
              </View>

              {/* Register Button */}
              <AppButton
                title={loading ? 'Creating Account...' : 'Sign Up'}
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                style={styles.registerButton}
              />
            </AppCard>
          )}

          {/* Login Link */}
          <View style={styles.footer}>
            <AppText variant="body">Already have an account? </AppText>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <AppText style={styles.loginLink}>Sign In</AppText>
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
  passwordHint: {
    color: theme.colors.muted,
    fontSize: 12,
    marginTop: theme.spacing.xs,
  },
  registerButton: {
    marginTop: theme.spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLink: {
    color: theme.colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;

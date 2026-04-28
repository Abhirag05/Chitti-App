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
import { useAuth } from '@context/AuthContext';
import { forgotPasswordSchema, ForgotPasswordFormData } from '@utils/validators/authValidators';
import theme from '@theme';

type Props = {
  navigation: any;
};

/**
 * ForgotPasswordScreen - Password reset email flow
 */
const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
  const { resetPassword, loading, error, clearError } = useAuth();
  const [emailSent, setEmailSent] = React.useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  /**
   * Handle password reset
   */
  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await resetPassword(data.email);
      setEmailSent(true);
      reset();
    } catch (err) {
      // Error is already in context
    }
  };

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      clearError();
    }
  }, [error, clearError]);

  /**
   * Handle back to login
   */
  const handleBackToLogin = () => {
    setEmailSent(false);
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ScreenContainer style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate('Login')}
          >
            <AppText style={styles.backButtonText}>← Back</AppText>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <AppText variant="h1" style={styles.title}>
              Reset Password
            </AppText>
            <AppText variant="body" style={styles.subtitle}>
              We'll send you an email to reset your password
            </AppText>
          </View>

          {/* Loading State */}
          {loading && <AppLoader />}

          {/* Email Sent Success State */}
          {emailSent && !loading && (
            <AppCard style={styles.successCard}>
              <View style={styles.successContent}>
                <AppText style={styles.successEmoji}>✉️</AppText>
                <AppText style={styles.successTitle}>Check Your Email</AppText>
                <AppText style={styles.successMessage}>
                  We've sent a password reset link to your email address. Please check your inbox
                  and follow the instructions to reset your password.
                </AppText>
                <AppButton
                  title="Back to Login"
                  onPress={handleBackToLogin}
                  style={styles.backToLoginButton}
                />
              </View>
            </AppCard>
          )}

          {/* Form */}
          {!emailSent && !loading && (
            <AppCard style={styles.form}>
              {/* Email Field */}
              <View style={styles.formGroup}>
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, value } }) => (
                    <AppInput
                      label="Email Address"
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

              {/* Submit Button */}
              <AppButton
                title="Send Reset Email"
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                style={styles.submitButton}
              />

              {/* Back to Login Link */}
              <TouchableOpacity
                style={styles.backLink}
                onPress={() => navigation.navigate('Login')}
              >
                <AppText style={styles.backLinkText}>Back to Login</AppText>
              </TouchableOpacity>
            </AppCard>
          )}
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.sm,
    marginLeft: -theme.spacing.sm,
  },
  backButtonText: {
    color: theme.colors.primary,
    fontWeight: '600',
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
    textAlign: 'center',
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
  submitButton: {
    marginTop: theme.spacing.lg,
  },
  backLink: {
    marginTop: theme.spacing.lg,
    alignItems: 'center',
  },
  backLinkText: {
    color: theme.colors.primary,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  successCard: {
    marginBottom: theme.spacing.lg,
  },
  successContent: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  successEmoji: {
    fontSize: 48,
    marginBottom: theme.spacing.md,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  successMessage: {
    textAlign: 'center',
    color: theme.colors.muted,
    marginBottom: theme.spacing.lg,
    lineHeight: 20,
  },
  backToLoginButton: {
    minWidth: 200,
  },
});

export default ForgotPasswordScreen;

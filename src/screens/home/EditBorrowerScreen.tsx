import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppHeader from '@components/layout/AppHeader';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppText from '@components/ui/AppText';
import AppInput from '@components/ui/AppInput';
import AppButton from '@components/ui/AppButton';
import AppLoader from '@components/ui/AppLoader';
import theme from '@theme';
import { useAuth } from '@context/AuthContext';
import { BorrowersStackParamList } from '@src/types/navigation';
import borrowerService from '@services/borrowerService';
import { FormSection } from '@components/forms';
import {
  BorrowerFormValues,
  borrowerFormSchema,
} from '@utils/validators/borrowerLoanValidators';

type Props = NativeStackScreenProps<BorrowersStackParamList, 'EditBorrower'>;

const EditBorrowerScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const { borrowerId } = route.params;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BorrowerFormValues>({
    resolver: zodResolver(borrowerFormSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      address: '',
      reference: '',
    },
  });

  useEffect(() => {
    const loadBorrower = async () => {
      if (!user?.uid) return;

      try {
        const borrower = await borrowerService.getBorrowerById(user.uid, borrowerId);
        if (borrower) {
          setValue('fullName', borrower.fullName);
          setValue('phoneNumber', borrower.phoneNumber);
          setValue('address', borrower.address);
          setValue('reference', borrower.reference || '');
        } else {
          Alert.alert('Error', 'Borrower not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Failed to load borrower:', error);
        Alert.alert('Error', 'Failed to load borrower details');
      } finally {
        setLoading(false);
      }
    };

    void loadBorrower();
  }, [borrowerId, navigation, setValue, user?.uid]);

  const onSubmit = async (values: BorrowerFormValues) => {
    if (!user?.uid) return;

    try {
      await borrowerService.updateBorrower(user.uid, borrowerId, values);
      Alert.alert('Success', 'Borrower updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Borrower update failed:', error);
      Alert.alert('Error', 'Failed to update borrower details');
    }
  };

  if (loading) {
    return <AppLoader />;
  }

  return (
    <View style={styles.flex}>
      <AppHeader
        title="Edit Borrower"
        leftIcon="arrow-back"
        onLeftPress={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScreenContainer style={styles.container}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.content}
          >
            <FormSection
              title="Borrower Information"
              description="Update the details for this borrower."
            >
              <Controller
                control={control}
                name="fullName"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.fieldSpacing}>
                    <AppInput label="Full Name" value={value} onChangeText={onChange} placeholder="Enter full name" />
                    {errors.fullName ? <AppText variant="small" style={styles.errorText}>{errors.fullName.message}</AppText> : null}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.fieldSpacing}>
                    <AppInput
                      label="Phone Number"
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter phone number"
                      keyboardType="phone-pad"
                    />
                    {errors.phoneNumber ? <AppText variant="small" style={styles.errorText}>{errors.phoneNumber.message}</AppText> : null}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="address"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.fieldSpacing}>
                    <AppInput
                      label="Address"
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter address"
                      multiline
                      numberOfLines={3}
                      style={styles.multilineInput}
                    />
                    {errors.address ? <AppText variant="small" style={styles.errorText}>{errors.address.message}</AppText> : null}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="reference"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.fieldSpacing}>
                    <AppInput
                      label="Reference (Optional)"
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter reference name"
                    />
                  </View>
                )}
              />
            </FormSection>

            <AppButton
              title={isSubmitting ? 'Updating...' : 'Update Borrower'}
              onPress={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              style={styles.submitButton}
            />
          </ScrollView>
        </ScreenContainer>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 0,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  fieldSpacing: {
    marginBottom: theme.spacing.sm,
  },
  errorText: {
    marginTop: theme.spacing.xxs,
    color: theme.colors.danger,
  },
  multilineInput: {
    minHeight: 88,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: theme.spacing.md,
  },
});

export default EditBorrowerScreen;

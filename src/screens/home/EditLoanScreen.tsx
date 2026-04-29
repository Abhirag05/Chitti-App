import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AppHeader from '@components/layout/AppHeader';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppText from '@components/ui/AppText';
import AppInput from '@components/ui/AppInput';
import AppButton from '@components/ui/AppButton';
import AppCard from '@components/ui/AppCard';
import AppLoader from '@components/ui/AppLoader';
import theme from '@theme';
import { useAuth } from '@context/AuthContext';
import { BorrowersStackParamList } from '@src/types/navigation';
import loanService from '@services/loanService';
import { CurrencyInput, DatePickerField, FormSection } from '@components/forms';
import {
  LoanEditFormValues,
  loanEditFormSchema,
} from '@utils/validators/borrowerLoanValidators';

type Props = NativeStackScreenProps<BorrowersStackParamList, 'EditLoan'>;

const toNumber = (value: string): number => {
  const parsed = Number(value.replace(/,/g, '').trim());
  return Number.isFinite(parsed) ? parsed : 0;
};

const addDays = (date: Date, days: number): Date => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const EditLoanScreen: React.FC<Props> = ({ navigation, route }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const { loanId, borrowerId } = route.params;

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoanEditFormValues>({
    resolver: zodResolver(loanEditFormSchema),
    defaultValues: {
      principalAmount: '',
      totalRepayableAmount: '',
      numberOfWeeks: '',
      startDate: new Date(),
      firstDueDate: new Date(),
      notes: '',
    },
  });

  const principalAmount = useWatch({ control, name: 'principalAmount' });
  const totalRepayableAmount = useWatch({ control, name: 'totalRepayableAmount' });
  const numberOfWeeks = useWatch({ control, name: 'numberOfWeeks' });
  const startDate = useWatch({ control, name: 'startDate' });
  const firstDueDate = useWatch({ control, name: 'firstDueDate' });

  const loanSummary = useMemo(() => {
    const principal = toNumber(principalAmount || '0');
    const repayable = toNumber(totalRepayableAmount || '0');
    const weeks = Number(numberOfWeeks || '0');

    if (principal <= 0 || repayable <= 0 || weeks <= 0) {
      return { profitAmount: 0, weeklyInstallment: 0 };
    }

    return loanService.calculateLoanSummary(principal, repayable, weeks);
  }, [principalAmount, totalRepayableAmount, numberOfWeeks]);

  useEffect(() => {
    const loadLoan = async () => {
      if (!user?.uid) return;

      try {
        const detail = await loanService.getLoanDetail(user.uid, loanId);
        if (detail) {
          const { loan } = detail;
          setValue('principalAmount', loan.principalAmount.toString());
          setValue('totalRepayableAmount', loan.totalRepayableAmount.toString());
          setValue('numberOfWeeks', loan.numberOfWeeks.toString());
          setValue('startDate', new Date(loan.startDate));
          setValue('firstDueDate', new Date(loan.firstDueDate));
          setValue('notes', loan.notes || '');
        } else {
          Alert.alert('Error', 'Loan not found');
          navigation.goBack();
        }
      } catch (error) {
        console.error('Failed to load loan:', error);
        Alert.alert('Error', 'Failed to load loan details');
      } finally {
        setLoading(false);
      }
    };

    void loadLoan();
  }, [loanId, navigation, setValue, user?.uid]);

  useEffect(() => {
    if (startDate > firstDueDate) {
      setValue('firstDueDate', addDays(startDate, 7), { shouldValidate: true });
    }
  }, [startDate, firstDueDate, setValue]);

  const onSubmit = async (values: LoanEditFormValues) => {
    if (!user?.uid) return;

    try {
      await loanService.updateLoan(user.uid, loanId, {
        principalAmount: toNumber(values.principalAmount),
        totalRepayableAmount: toNumber(values.totalRepayableAmount),
        numberOfWeeks: Number(values.numberOfWeeks),
        startDate: values.startDate.getTime(),
        firstDueDate: values.firstDueDate.getTime(),
        notes: values.notes,
      });
      Alert.alert('Success', 'Loan updated successfully');
      navigation.goBack();
    } catch (error) {
      console.error('Loan update failed:', error);
      Alert.alert('Error', 'Failed to update loan details');
    }
  };

  if (loading) {
    return <AppLoader />;
  }

  return (
    <View style={styles.flex}>
      <AppHeader
        title="Edit Loan"
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
              title="Loan Details"
              description="Update the loan terms. If no payments have been made, installments will be recalculated."
            >
              <Controller
                control={control}
                name="principalAmount"
                render={({ field: { value, onChange } }) => (
                  <CurrencyInput
                    label="Principal Amount"
                    value={value}
                    onChangeValue={onChange}
                    error={errors.principalAmount?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="totalRepayableAmount"
                render={({ field: { value, onChange } }) => (
                  <CurrencyInput
                    label="Total Repayable Amount"
                    value={value}
                    onChangeValue={onChange}
                    error={errors.totalRepayableAmount?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="numberOfWeeks"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.fieldSpacing}>
                    <AppInput
                      label="Number of Weeks"
                      value={value}
                      onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ''))}
                      placeholder="Enter number of weeks"
                      keyboardType="number-pad"
                    />
                    {errors.numberOfWeeks ? <AppText variant="small" style={styles.errorText}>{errors.numberOfWeeks.message}</AppText> : null}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="startDate"
                render={({ field: { value, onChange } }) => (
                  <DatePickerField
                    label="Given Date"
                    value={value}
                    onChange={onChange}
                    error={errors.startDate?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="firstDueDate"
                render={({ field: { value, onChange } }) => (
                  <DatePickerField
                    label="First Due Date"
                    value={value}
                    onChange={onChange}
                    minimumDate={startDate}
                    error={errors.firstDueDate?.message}
                  />
                )}
              />

              <Controller
                control={control}
                name="notes"
                render={({ field: { value, onChange } }) => (
                  <View style={styles.fieldSpacing}>
                    <AppInput
                      label="Notes"
                      value={value}
                      onChangeText={onChange}
                      placeholder="Optional notes"
                      multiline
                      numberOfLines={4}
                      style={styles.multilineInput}
                    />
                  </View>
                )}
              />

              <AppCard style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <View style={styles.summaryItem}>
                    <AppText variant="small" style={styles.summaryLabel}>
                      Profit
                    </AppText>
                    <AppText variant="h3">₹ {loanSummary.profitAmount.toFixed(2)}</AppText>
                  </View>

                  <View style={styles.summaryDivider} />

                  <View style={styles.summaryItem}>
                    <AppText variant="small" style={styles.summaryLabel}>
                      Weekly Installment
                    </AppText>
                    <AppText variant="h3">₹ {loanSummary.weeklyInstallment.toFixed(2)}</AppText>
                  </View>
                </View>
              </AppCard>
            </FormSection>

            <AppButton
              title={isSubmitting ? 'Updating...' : 'Update Loan'}
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
  summaryCard: {
    marginTop: theme.spacing.sm,
    backgroundColor: '#f8fafc',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
  },
  summaryLabel: {
    color: theme.colors.muted,
    marginBottom: theme.spacing.xxs,
  },
  summaryDivider: {
    width: 1,
    alignSelf: 'stretch',
    backgroundColor: '#e5e7eb',
    marginHorizontal: theme.spacing.md,
  },
  submitButton: {
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
});

export default EditLoanScreen;

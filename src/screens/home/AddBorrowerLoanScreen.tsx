import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import AppHeader from '@components/layout/AppHeader';
import ScreenContainer from '@components/ui/ScreenContainer';
import AppText from '@components/ui/AppText';
import AppInput from '@components/ui/AppInput';
import AppButton from '@components/ui/AppButton';
import AppCard from '@components/ui/AppCard';
import theme from '@theme';
import { useAuth } from '@context/AuthContext';
import { AppDrawerParamList } from '@src/types/navigation';
import { Borrower, BorrowerCreateInput } from '@src/models';
import borrowerService from '@services/borrowerService';
import loanService from '@services/loanService';
import { BorrowerSelector, CurrencyInput, DatePickerField, FormSection } from '@components/forms';
import {
  BorrowerLoanFormValues,
  borrowerLoanFormSchema,
} from '@utils/validators/borrowerLoanValidators';

type Props = {
  navigation: DrawerNavigationProp<AppDrawerParamList, 'AddBorrower'>;
};

const addDays = (date: Date, days: number): Date => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
};

const toNumber = (value: string): number => {
  const parsed = Number(value.replace(/,/g, '').trim());
  return Number.isFinite(parsed) ? parsed : 0;
};

const defaultValues: BorrowerLoanFormValues = {
  borrowerMode: 'new',
  borrowerId: '',
  fullName: '',
  phoneNumber: '',
  address: '',
  reference: '',
  principalAmount: '',
  totalRepayableAmount: '',
  numberOfWeeks: '',
  startDate: new Date(),
  firstDueDate: addDays(new Date(), 7),
  notes: '',
};

const AddBorrowerLoanScreen: React.FC<Props> = ({ navigation }) => {
  const { user } = useAuth();
  const [borrowers, setBorrowers] = useState<Borrower[]>([]);
  const [selectedBorrower, setSelectedBorrower] = useState<Borrower | null>(null);
  const [borrowersLoading, setBorrowersLoading] = useState(true);
  const [autoDetectMessage, setAutoDetectMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BorrowerLoanFormValues>({
    resolver: zodResolver(borrowerLoanFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const borrowerMode = useWatch({ control, name: 'borrowerMode' });
  const borrowerId = useWatch({ control, name: 'borrowerId' });
  const phoneNumber = useWatch({ control, name: 'phoneNumber' });
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
    const loadBorrowers = async () => {
      if (!user?.uid) {
        setBorrowersLoading(false);
        return;
      }

      try {
        const items = await borrowerService.getBorrowersByUser(user.uid);
        setBorrowers(items);
      } catch (error) {
        console.error('Failed to load borrowers:', error);
      } finally {
        setBorrowersLoading(false);
      }
    };

    void loadBorrowers();
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid || borrowerMode !== 'new') {
      return;
    }

    const normalizedPhone = phoneNumber.replace(/\D/g, '');
    if (normalizedPhone.length < 7) {
      setAutoDetectMessage(null);
      return;
    }

    const timer = setTimeout(() => {
      void (async () => {
        try {
          const matchedBorrower = await borrowerService.findBorrowerByPhone(user.uid, normalizedPhone);
          if (matchedBorrower) {
            setSelectedBorrower(matchedBorrower);
            setValue('borrowerId', matchedBorrower.id, { shouldValidate: true });
            setValue('borrowerMode', 'existing', { shouldValidate: true });
            setAutoDetectMessage('Borrower already exists, adding new loan');
          } else {
            setAutoDetectMessage(null);
          }
        } catch (error) {
          console.error('Borrower auto-detection failed:', error);
        }
      })();
    }, 350);

    return () => clearTimeout(timer);
  }, [phoneNumber, borrowerMode, setValue, user?.uid]);

  useEffect(() => {
    if (startDate > firstDueDate) {
      setValue('firstDueDate', addDays(startDate, 7), { shouldValidate: true });
    }
  }, [startDate, firstDueDate, setValue]);

  const handleBorrowerModeChange = (mode: 'existing' | 'new') => {
    setValue('borrowerMode', mode, { shouldValidate: true });

    if (mode === 'new') {
      setValue('borrowerId', '', { shouldValidate: true });
      setValue('phoneNumber', '', { shouldValidate: true });
      setValue('fullName', '', { shouldValidate: true });
      setValue('address', '', { shouldValidate: true });
      setValue('reference', '', { shouldValidate: true });
      setAutoDetectMessage(null);
      setSelectedBorrower(null);
      return;
    }

    if (selectedBorrower) {
      setValue('borrowerId', selectedBorrower.id, { shouldValidate: true });
    }
  };

  const handleBorrowerSelect = (borrower: Borrower) => {
    setSelectedBorrower(borrower);
    setValue('borrowerMode', 'existing', { shouldValidate: true });
    setValue('borrowerId', borrower.id, { shouldValidate: true });
    setValue('phoneNumber', borrower.phoneNumber, { shouldValidate: true });
    setAutoDetectMessage('Borrower already exists, adding new loan');
  };

  const handleStartDateChange = (nextDate: Date) => {
    setValue('startDate', nextDate, { shouldValidate: true });
    if (firstDueDate < nextDate) {
      setValue('firstDueDate', addDays(nextDate, 7), { shouldValidate: true });
    }
  };

  const onSubmit = async (values: BorrowerLoanFormValues) => {
    if (!user?.uid) {
      Alert.alert('Authentication required', 'Please sign in again to continue.');
      return;
    }

    try {
      let borrower: Borrower | null = selectedBorrower;

      if (values.borrowerMode === 'new') {
        const borrowerInput: BorrowerCreateInput = {
          fullName: values.fullName,
          phoneNumber: values.phoneNumber,
          address: values.address,
          reference: values.reference,
        };

        borrower = await borrowerService.createBorrower(user.uid, borrowerInput);
        setBorrowers((currentBorrowers) => [borrower as Borrower, ...currentBorrowers]);
      }

      if (!borrower) {
        throw new Error('Select a borrower before creating the loan.');
      }

      await loanService.createLoanWithInstallments({
        borrowerId: borrower.id,
        borrowerName: borrower.fullName,
        ownerId: user.uid,
        principalAmount: toNumber(values.principalAmount),
        totalRepayableAmount: toNumber(values.totalRepayableAmount),
        numberOfWeeks: Number(values.numberOfWeeks),
        startDate: values.startDate.getTime(),
        firstDueDate: values.firstDueDate.getTime(),
        notes: values.notes,
      });

      Alert.alert('Success', 'Borrower and loan created successfully.');
      setSelectedBorrower(null);
      setAutoDetectMessage(null);
      reset(defaultValues);
    } catch (error) {
      console.error('Borrower loan creation failed:', error);
      const message = error instanceof Error ? error.message : 'Failed to create borrower and loan.';
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={styles.flex}>
      <AppHeader title="Add Borrower & Loan" onMenuPress={() => navigation.openDrawer()} />

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
              title="Borrower Section"
              description="Choose an existing borrower or create a new one. Phone lookup switches modes automatically when a match is found."
            >
              <View style={styles.modeToggle}>
                <TouchableOpacity
                  style={[styles.modeButton, borrowerMode === 'existing' && styles.modeButtonActive]}
                  onPress={() => handleBorrowerModeChange('existing')}
                  activeOpacity={0.8}
                >
                  <AppText style={[styles.modeButtonText, borrowerMode === 'existing' && styles.modeButtonTextActive]}>
                    Select Existing
                  </AppText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modeButton, borrowerMode === 'new' && styles.modeButtonActive]}
                  onPress={() => handleBorrowerModeChange('new')}
                  activeOpacity={0.8}
                >
                  <AppText style={[styles.modeButtonText, borrowerMode === 'new' && styles.modeButtonTextActive]}>
                    Add New
                  </AppText>
                </TouchableOpacity>
              </View>

              {borrowerMode === 'existing' ? (
                <BorrowerSelector
                  borrowers={borrowers}
                  selectedBorrowerId={borrowerId}
                  onSelectBorrower={handleBorrowerSelect}
                  loading={borrowersLoading}
                  message={autoDetectMessage ?? undefined}
                />
              ) : (
                <View>
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
                        {errors.reference ? <AppText variant="small" style={styles.errorText}>{errors.reference.message}</AppText> : null}
                      </View>
                    )}
                  />
                </View>
              )}
            </FormSection>

            <FormSection
              title="Loan Section"
              description="Enter the loan terms. Profit and weekly installment are calculated automatically."
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
                    onChange={(nextDate) => {
                      onChange(nextDate);
                      handleStartDateChange(nextDate);
                    }}
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
              title={isSubmitting ? 'Creating...' : 'Create Borrower & Loan'}
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
  modeToggle: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  modeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: theme.radius.md,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
  },
  modeButtonActive: {
    borderColor: theme.colors.accent,
    backgroundColor: '#f5f3ff',
  },
  modeButtonText: {
    color: theme.colors.muted,
    fontWeight: '600',
  },
  modeButtonTextActive: {
    color: theme.colors.accent,
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
    marginBottom: theme.spacing.md,
  },
});

export default AddBorrowerLoanScreen;

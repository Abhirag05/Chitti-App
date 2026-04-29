import { z } from 'zod';

const currencyString = z
  .string()
  .transform((value) => value.replace(/,/g, '').trim())
  .refine((value) => value.length > 0 && !Number.isNaN(Number(value)), 'Enter a valid amount');

const weeksString = z
  .string()
  .transform((value) => value.trim())
  .refine((value) => value.length > 0 && Number.isInteger(Number(value)), 'Enter a valid week count');

export const borrowerLoanFormSchema = z
  .object({
    borrowerMode: z.enum(['existing', 'new']),
    borrowerId: z.string().optional().default(''),
    fullName: z.string().optional().default(''),
    phoneNumber: z.string().optional().default(''),
    address: z.string().optional().default(''),
    reference: z.string().optional().default(''),
    principalAmount: currencyString,
    totalRepayableAmount: currencyString,
    numberOfWeeks: weeksString,
    startDate: z.date(),
    firstDueDate: z.date(),
    notes: z.string().optional().default(''),
  })
  .superRefine((value, context) => {
    const principalAmount = Number(value.principalAmount);
    const totalRepayableAmount = Number(value.totalRepayableAmount);
    const numberOfWeeks = Number(value.numberOfWeeks);

    if (value.borrowerMode === 'existing' && !value.borrowerId) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Select an existing borrower',
        path: ['borrowerId'],
      });
    }

    if (value.borrowerMode === 'new') {
      const phoneNumber = value.phoneNumber.replace(/\D/g, '');

      if (!value.fullName?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Full name is required',
          path: ['fullName'],
        });
      }

      if (phoneNumber.length < 7 || phoneNumber.length > 15) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Enter a valid phone number',
          path: ['phoneNumber'],
        });
      }

      if (!value.address?.trim()) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Address is required',
          path: ['address'],
        });
      }


    }

    if (principalAmount <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Principal amount must be greater than 0',
        path: ['principalAmount'],
      });
    }

    if (totalRepayableAmount < principalAmount) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Repayable amount must be greater than or equal to principal amount',
        path: ['totalRepayableAmount'],
      });
    }

    if (numberOfWeeks <= 0) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Weeks must be greater than 0',
        path: ['numberOfWeeks'],
      });
    }

    if (value.firstDueDate < value.startDate) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'First due date cannot be before the given date',
        path: ['firstDueDate'],
      });
    }
  });

export type BorrowerLoanFormValues = z.infer<typeof borrowerLoanFormSchema>;

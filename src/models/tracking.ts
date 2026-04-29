import { Borrower } from './borrower';
import { Installment, InstallmentStatus } from './installment';
import { Loan } from './loan';

export type BorrowerSummary = Borrower & {
  totalActiveLoansCount: number;
  totalOutstandingAmount: number;
};

export type LoanProgress = {
  completedWeeks: number;
  pendingWeeks: number;
  overdueWeeks: number;
  outstandingAmount: number;
};

export type LoanWithProgress = Loan & LoanProgress;

export type InstallmentWithStatus = Installment & {
  effectiveStatus: InstallmentStatus;
};

export type LoanDetailView = {
  loan: LoanWithProgress;
  installments: InstallmentWithStatus[];
};

export type InstallmentTrackingItem = InstallmentWithStatus & {
  daysOverdue: number;
  loanReference: string;
};

export type DashboardStats = {
  totalActiveLoans: number;
  totalOutstandingAmount: number;
  totalProfit: number;
  dueTodayCount: number;
  overdueCount: number;
  completedLoansCount: number;
  recentPayments: InstallmentTrackingItem[];
};

export type InstallmentStatus = 'pending' | 'paid' | 'overdue';

export type Installment = {
  id: string;
  loanId: string;
  borrowerId: string;
  borrowerName: string;
  ownerId: string;
  weekNumber: number;
  dueDate: number;
  amount: number;
  status: InstallmentStatus;
  paidAt: number | null;
};

export type InstallmentCreateInput = {
  loanId: string;
  borrowerId: string;
  borrowerName: string;
  ownerId: string;
  numberOfWeeks: number;
  firstDueDate: number;
  totalRepayableAmount: number;
  weeklyInstallment: number;
};

export type LoanStatus = 'active' | 'completed';

export type Loan = {
  id: string;
  borrowerId: string;
  borrowerName: string;
  ownerId: string;
  principalAmount: number;
  totalRepayableAmount: number;
  profitAmount: number;
  numberOfWeeks: number;
  weeklyInstallment: number;
  startDate: number;
  firstDueDate: number;
  notes: string;
  status: LoanStatus;
  createdAt: number;
};

export type LoanCreateInput = {
  borrowerId: string;
  borrowerName: string;
  ownerId: string;
  principalAmount: number;
  totalRepayableAmount: number;
  numberOfWeeks: number;
  startDate: number;
  firstDueDate: number;
  notes?: string;
};

export type LoanSummary = {
  profitAmount: number;
  weeklyInstallment: number;
};

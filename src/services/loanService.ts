import loanRepository from '@src/repositories/loanRepository';
import installmentRepository from '@src/repositories/installmentRepository';
import installmentService from './installmentService';
import { Loan, LoanCreateInput, LoanDetailView, LoanProgress, LoanSummary, LoanWithProgress } from '@src/models';

const roundToTwo = (value: number): number => Math.round(value * 100) / 100;

class LoanService {
  calculateLoanSummary(principalAmount: number, totalRepayableAmount: number, numberOfWeeks: number): LoanSummary {
    const profitAmount = roundToTwo(totalRepayableAmount - principalAmount);
    const weeklyInstallment = roundToTwo(totalRepayableAmount / numberOfWeeks);

    return { profitAmount, weeklyInstallment };
  }

  calculateLoanProgress(loan: Loan, installments: { effectiveStatus: 'pending' | 'paid' | 'overdue'; amount: number }[]): LoanProgress {
    const completedWeeks = installments.filter((installment) => installment.effectiveStatus === 'paid').length;
    const pendingWeeks = installments.filter((installment) => installment.effectiveStatus === 'pending').length;
    const overdueWeeks = installments.filter((installment) => installment.effectiveStatus === 'overdue').length;
    const outstandingAmount = roundToTwo(
      installments
        .filter((installment) => installment.effectiveStatus !== 'paid')
        .reduce((total, installment) => total + installment.amount, 0)
    );

    return { completedWeeks, pendingWeeks, overdueWeeks, outstandingAmount };
  }

  async getLoansByBorrower(ownerId: string, borrowerId: string): Promise<LoanWithProgress[]> {
    const loans = await loanRepository.getLoansByOwnerAndBorrower(ownerId, borrowerId);

    const enrichedLoans = await Promise.all(
      loans.map(async (loan) => {
        const installments = await installmentService.getInstallmentsByLoan(ownerId, loan.id);
        const progress = this.calculateLoanProgress(loan, installments);

        return {
          ...loan,
          ...progress,
        };
      })
    );

    return enrichedLoans.sort((left, right) => right.createdAt - left.createdAt);
  }

  async getLoanDetail(ownerId: string, loanId: string): Promise<LoanDetailView | null> {
    const loan = await loanRepository.getLoanById(ownerId, loanId);
    if (!loan) {
      return null;
    }

    const installments = await installmentService.getInstallmentsByLoan(ownerId, loan.id);
    const progress = this.calculateLoanProgress(loan, installments);

    return {
      loan: {
        ...loan,
        ...progress,
      },
      installments,
    };
  }

  async markInstallmentAsPaid(ownerId: string, loanId: string, installmentId: string): Promise<LoanDetailView | null> {
    const loan = await loanRepository.getLoanById(ownerId, loanId);
    if (!loan) {
      return null;
    }

    await installmentService.markInstallmentAsPaid(installmentId);

    const refreshedDetail = await this.getLoanDetail(ownerId, loanId);
    if (!refreshedDetail) {
      return null;
    }

    if (refreshedDetail.loan.pendingWeeks === 0 && refreshedDetail.loan.overdueWeeks === 0) {
      await loanRepository.updateLoanStatus(loanId, 'completed');
      refreshedDetail.loan.status = 'completed';
    }

    return refreshedDetail;
  }

  async createLoanWithInstallments(input: LoanCreateInput): Promise<{ loan: Loan }> {
    const summary = this.calculateLoanSummary(
      input.principalAmount,
      input.totalRepayableAmount,
      input.numberOfWeeks
    );

    const now = Date.now();
    const loan: Loan = {
      id: loanRepository.generateId(),
      borrowerId: input.borrowerId,
      borrowerName: input.borrowerName,
      ownerId: input.ownerId,
      principalAmount: roundToTwo(input.principalAmount),
      totalRepayableAmount: roundToTwo(input.totalRepayableAmount),
      profitAmount: summary.profitAmount,
      numberOfWeeks: input.numberOfWeeks,
      weeklyInstallment: summary.weeklyInstallment,
      startDate: input.startDate,
      firstDueDate: input.firstDueDate,
      notes: input.notes?.trim() || '',
      status: 'active',
      createdAt: now,
    };

    await loanRepository.createLoan(loan);

    const installments = installmentService.generateInstallments({
      loanId: loan.id,
      borrowerId: loan.borrowerId,
      borrowerName: loan.borrowerName,
      ownerId: loan.ownerId,
      numberOfWeeks: loan.numberOfWeeks,
      firstDueDate: loan.firstDueDate,
      totalRepayableAmount: loan.totalRepayableAmount,
      weeklyInstallment: loan.weeklyInstallment,
    });

    await installmentService.createInstallments(installments);

    return { loan };
  }

  async deleteLoan(ownerId: string, loanId: string): Promise<void> {
    const loan = await loanRepository.getLoanById(ownerId, loanId);
    if (!loan) {
      throw new Error('Loan not found or access denied');
    }

    await installmentRepository.deleteInstallmentsByLoan(ownerId, loanId);
    await loanRepository.deleteLoan(loanId);
  }
}

export default new LoanService();

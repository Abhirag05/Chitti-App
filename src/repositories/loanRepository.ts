import { where, updateDoc } from 'firebase/firestore';
import { BaseRepository } from './baseRepository';
import { Loan } from '@src/models';
import { FirestoreCollections } from '@src/constants/firestoreCollections';

export class LoanRepository extends BaseRepository {
  constructor() {
    super(FirestoreCollections.Loans);
  }

  async createLoan(loan: Loan): Promise<Loan> {
    return this.save(loan);
  }

  async updateLoanStatus(loanId: string, status: Loan['status']): Promise<void> {
    await updateDoc(this.docRef(loanId), { status });
  }

  async getLoanById(ownerId: string, loanId: string): Promise<Loan | null> {
    const loan = await this.getById<Loan>(loanId);
    if (!loan || loan.ownerId !== ownerId) {
      return null;
    }

    return loan;
  }

  async getLoansByOwner(ownerId: string): Promise<Loan[]> {
    return this.getMany<Loan>([where('ownerId', '==', ownerId)]);
  }

  async getLoansByBorrower(borrowerId: string): Promise<Loan[]> {
    return this.getMany<Loan>([where('borrowerId', '==', borrowerId)]);
  }

  async getLoansByOwnerAndBorrower(ownerId: string, borrowerId: string): Promise<Loan[]> {
    return this.getMany<Loan>([
      where('ownerId', '==', ownerId),
      where('borrowerId', '==', borrowerId),
    ]);
  }
}

export default new LoanRepository();

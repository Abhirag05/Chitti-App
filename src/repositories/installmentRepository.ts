import { writeBatch, where, updateDoc } from 'firebase/firestore';
import { BaseRepository } from './baseRepository';
import { Installment } from '@src/models';
import { FirestoreCollections } from '@src/constants/firestoreCollections';

export class InstallmentRepository extends BaseRepository {
  constructor() {
    super(FirestoreCollections.Installments);
  }

  async createInstallments(installments: Installment[]): Promise<Installment[]> {
    if (installments.length === 0) {
      return [];
    }

    const batch = writeBatch(this.db);

    installments.forEach((installment) => {
      batch.set(this.docRef(installment.id), installment);
    });

    await batch.commit();

    return installments;
  }

  async getInstallmentsByLoan(ownerId: string, loanId: string): Promise<Installment[]> {
    return this.getMany<Installment>([
      where('ownerId', '==', ownerId),
      where('loanId', '==', loanId),
    ]);
  }

  async markPaid(installmentId: string): Promise<void> {
    await updateDoc(this.docRef(installmentId), {
      status: 'paid',
      paidAt: Date.now(),
    });
  }
}

export default new InstallmentRepository();

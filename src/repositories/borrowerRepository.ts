import { limit, where } from 'firebase/firestore';
import { BaseRepository } from './baseRepository';
import { Borrower } from '@src/models';
import { FirestoreCollections } from '@src/constants/firestoreCollections';

export class BorrowerRepository extends BaseRepository {
  constructor() {
    super(FirestoreCollections.Borrowers);
  }

  async createBorrower(borrower: Borrower): Promise<Borrower> {
    return this.save(borrower);
  }

  async getBorrowerById(ownerId: string, borrowerId: string): Promise<Borrower | null> {
    const borrower = await this.getById<Borrower>(borrowerId);
    if (!borrower || borrower.ownerId !== ownerId) {
      return null;
    }

    return borrower;
  }

  async getBorrowersByOwner(ownerId: string): Promise<Borrower[]> {
    const borrowers = await this.getMany<Borrower>([where('ownerId', '==', ownerId)]);
    return borrowers.sort((left, right) => right.createdAt - left.createdAt);
  }

  async findByPhone(ownerId: string, phoneNumber: string): Promise<Borrower | null> {
    const borrowers = await this.getMany<Borrower>([
      where('ownerId', '==', ownerId),
      where('phoneNumber', '==', phoneNumber),
      limit(1),
    ]);

    return borrowers[0] ?? null;
  }

  async deleteBorrower(borrowerId: string): Promise<void> {
    await this.delete(borrowerId);
  }
}

export default new BorrowerRepository();

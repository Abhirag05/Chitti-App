export const FirestoreCollections = {
  Borrowers: 'borrowers',
  Loans: 'loans',
  Installments: 'installments',
} as const;

export type FirestoreCollectionName = (typeof FirestoreCollections)[keyof typeof FirestoreCollections];

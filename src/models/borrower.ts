export type Borrower = {
  id: string;
  ownerId: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  reference: string;
  createdAt: number;
};

export type BorrowerCreateInput = {
  fullName: string;
  phoneNumber: string;
  address: string;
  reference: string;
};

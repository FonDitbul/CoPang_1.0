export type Seller = {
  id: number;
  userId: string;
  ceoName: string;
  companyName: string;
  password: string;
  deletedAt: Date | null;
};

export type SellerSignUpIn = Pick<Seller, 'userId' | 'ceoName' | 'companyName' | 'password'>;

export type SellerSignUpOut = Pick<Seller, 'userId' | 'ceoName' | 'companyName' | 'password'>;

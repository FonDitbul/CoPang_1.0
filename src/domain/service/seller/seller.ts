export type Seller = {
  id: number;
  userId: string;
  ceoName: string;
  companyName: string;
  password: string;
  deletedAt: Date | null;
};

export type TSellerSignUpIn = Pick<Seller, 'userId' | 'ceoName' | 'companyName' | 'password'>;

export type TSellerSignUpOut = Pick<Seller, 'userId' | 'ceoName' | 'companyName' | 'password'>;

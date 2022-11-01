export type Seller = {
  id: number;
  userId: string;
  ceoName: string;
  companyName: string;
  password: string;
  deletedAt: Date | null;
};

export type SellerSignUpInbound = Pick<Seller, 'userId' | 'ceoName' | 'companyName' | 'password'>;

export type SellerSignUpOutbound = Pick<Seller, 'userId' | 'ceoName' | 'companyName' | 'password'>;

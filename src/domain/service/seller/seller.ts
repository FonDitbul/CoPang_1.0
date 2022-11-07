export type Seller = {
  id: number;
  userId: string;
  ceoName: string;
  companyName: string;
  password: string;
  deletedAt: Date | null;
};

export type TCreateSeller = Pick<Seller, 'userId' | 'ceoName' | 'companyName' | 'password'>;

export type TSellerFindIn = Pick<Seller, 'userId' | 'password'>;
export type TSellerFindOut = Pick<Seller, 'userId' | 'ceoName' | 'companyName' | 'password'>;

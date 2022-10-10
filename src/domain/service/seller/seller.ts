export type Seller = {
  id: number;
  userId: string;
  ceoName: string;
  companyName: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type TCreateSeller = Pick<Seller, 'userId' | 'ceoName' | 'companyName' | 'password'>;
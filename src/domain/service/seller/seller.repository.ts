import { Seller, TSellerChangeInfoOut, TSellerSignUpOut } from './seller';

export interface ISellerRepository {
  findOne: (userId: string) => Promise<Seller>;
  findAll: () => Promise<Seller[]>;
  signUp: (sellerSignUpOutbound: TSellerSignUpOut) => Promise<Seller>;
  delete: (userId: string) => Promise<Seller>;
  update: (changeSeller: TSellerChangeInfoOut) => Promise<Seller>;
}

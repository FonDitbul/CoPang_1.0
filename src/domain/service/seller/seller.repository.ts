import { Seller, SellerSignUpOut } from './seller';

export interface ISellerRepository {
  findOne: (userId: string) => Promise<Seller>;
  findAll: () => Promise<Seller[]>;
  signUp: (sellerSignUpOutbound: SellerSignUpOut) => Promise<Seller>;
  delete: (userId: string) => Promise<Seller>;
}

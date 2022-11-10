import { Seller, TSellerSignUpOut, TSellerFindIn } from './seller';

export interface ISellerRepository {
  findUserInfo: (seller: TSellerFindIn) => Promise<Seller>;
  findOne: (userId: string) => Promise<Seller>;
  findAll: () => Promise<Seller[]>;
  signUp: (sellerSignUpOutbound: TSellerSignUpOut) => Promise<Seller>;
  delete: (userId: string) => Promise<Seller>;
}

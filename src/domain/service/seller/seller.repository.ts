import { Seller, SellerSignUpOutbound } from './seller';

export interface ISellerRepository {
  findOne: (userId: string) => Promise<Seller>;
  findAll: () => Promise<Seller[]>;
  create: (sellerSignUpOutbound: SellerSignUpOutbound) => Promise<Seller>;
  delete: (userId: string) => Promise<Seller>;
}

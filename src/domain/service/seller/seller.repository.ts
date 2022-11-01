import { Seller, SellerSignUpInbound } from './seller';

export interface ISellerRepository {
  findOne: (userId: string) => Promise<Seller>;
  findAll: () => Promise<Seller[]>;
  create: (seller: SellerSignUpInbound) => Promise<Seller>;
  delete: (userId: string) => Promise<Seller>;
}

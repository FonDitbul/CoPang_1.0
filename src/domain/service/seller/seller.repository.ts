import { Seller, TCreateSeller } from './seller';

export interface ISellerRepository {
  findOne: (userId: string) => Promise<Seller>;
  findAll: () => Promise<Seller[]>;
  create: (seller: TCreateSeller) => Promise<Seller>;
  delete: (userId: string) => Promise<Seller>;
}

import { Seller, TCreateSeller, TSellerFindIn } from './seller';

export interface ISellerRepository {
  findUserInfo: (seller: TSellerFindIn) => Promise<Seller>;
  findOne: (userId: string) => Promise<Seller>;
  findAll: () => Promise<Seller[]>;
  create: (seller: TCreateSeller) => Promise<Seller>;
  delete: (userId: string) => Promise<Seller>;
}

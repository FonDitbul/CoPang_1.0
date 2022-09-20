import { Seller } from '../domain/seller';
import { CreateSellerDto } from '../interface/create-seller.dto';

export interface ISellerRepository {
  findOne: (userId: string) => Promise<Seller>;
  findAll: () => Promise<Seller[]>;
  create: (seller: CreateSellerDto) => Promise<Seller>;
  delete: (userId: string) => Promise<Seller>;
}

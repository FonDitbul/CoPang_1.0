import { Product } from './product';
import { TSellerFindProductOut } from '../seller/seller';
import { SellerProduct as SellerProductEntity } from '@prisma/client';

export interface IProductRepository {
  findAll: () => Promise<Product[]>;
  findAllWithSeller: (condition: TSellerFindProductOut) => Promise<SellerProductEntity[]>;
  findAllWithSellerCount: (condition: TSellerFindProductOut) => Promise<number>;
}

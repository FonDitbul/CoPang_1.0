import { Product } from './product';
import { SellerProduct, TSellerFindProductOut, TSellerSearchProductOut } from '../seller/seller';
import { SellerProduct as SellerProductEntity } from '@prisma/client';

export interface IProductRepository {
  findAll: () => Promise<Product[]>;
  findAllWithSellerAndCount: (condition: TSellerFindProductOut) => Promise<[number, SellerProductEntity[]]>;
  findSearchWithSellerAndCount: (condition: TSellerSearchProductOut) => Promise<[number, SellerProductEntity[]]>;
}

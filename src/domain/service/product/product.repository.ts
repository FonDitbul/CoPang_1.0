import { Product } from './product';

export interface IProductRepository {
  findAll: () => Promise<Product[]>;
}

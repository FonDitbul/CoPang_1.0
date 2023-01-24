import { SellerProduct, TSellerFindProductOut } from '../seller/seller';
import { SellerProduct as SellerProductEntity } from '@prisma/client';
import { IAddProductOut, IAddSellerProductOut, Product } from './product';

export interface IProductRepository {
  findAllWithSeller: (condition: TSellerFindProductOut) => Promise<SellerProductEntity[]>;
  findAllWithSellerCount: (condition: TSellerFindProductOut) => Promise<number>;
  addOne: (addProductOut: IAddProductOut) => Promise<Product>;
  addOneSellerProduct: (addSellerProductOut: IAddSellerProductOut) => Promise<SellerProduct>;
  // TODO : 트랜잭션 기능 추가하면 삭제될 수 있는 메소드(이름 일부러 delete가 아닌 remove로 지음)
  removeProductEntity: (productId: number) => Promise<void>;
  removeSellerProductEntity: (sellerProductId: number) => Promise<void>;
  //////////////////////////////////////////
}

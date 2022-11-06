// seller service domain 생성하기
// interface

import { Seller, TSellerSignUpIn } from './seller';

export interface ISellerService {
  getOne: (userId: string) => Promise<Seller>;
  getAll: () => Promise<Seller[]>;
  signUp: (sellerSignUpIn: TSellerSignUpIn) => Promise<Seller>;
  delete: (userId: string) => Promise<Seller>;
}

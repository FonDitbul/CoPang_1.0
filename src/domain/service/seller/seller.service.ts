// seller service domain 생성하기
// interface

import { Seller, SellerSignUpInbound } from './seller';

export interface ISellerService {
  getOne: (userId: string) => Promise<Seller>;
  getAll: () => Promise<Seller[]>;
  signUp: (sellerSignUpInbound: SellerSignUpInbound) => Promise<Seller>;
  delete: (userId: string) => Promise<Seller>;
}

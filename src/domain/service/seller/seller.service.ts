// seller service domain 생성하기
// interface

import { ISellerSignInIn, Seller, TCreateSeller } from './seller';

export interface ISellerService {
  getOne: (userId: string) => Promise<Seller>;
  getAll: () => Promise<Seller[]>;
  create: (seller: TCreateSeller) => Promise<Seller>;
  delete: (userId: string) => Promise<Seller>;
  signIn: (signInSeller: ISellerSignInIn) => Promise<Seller>;
  signOut: (userId: string) => Promise<boolean>;
}

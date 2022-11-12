// seller service domain 생성하기
// interface

import { Seller, TSellerSignUpIn, ISellerSignInIn } from './seller';

export interface ISellerService {
  getOne: (userId: string) => Promise<Seller>;
  getAll: () => Promise<Seller[]>;
  signUp: (sellerSignUpIn: TSellerSignUpIn) => Promise<Seller>;
  delete: (userId: string) => Promise<Seller>;
  signIn: (signInSeller: ISellerSignInIn) => Promise<Seller>;
  signOut: (userId: string) => Promise<boolean>;
  leave: (userId: string) => Promise<Seller>;
}

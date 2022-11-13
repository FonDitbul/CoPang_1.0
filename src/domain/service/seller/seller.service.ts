// seller service domain 생성하기
// interface

import { Seller, TSellerSignUpIn, ISellerSignInIn } from './seller';

export interface ISellerService {
  signUp: (sellerSignUpIn: TSellerSignUpIn) => Promise<Seller>;
  signIn: (signInSeller: ISellerSignInIn) => Promise<Seller>;
  signOut: (userId: string) => Promise<boolean>;
  leave: (userId: string) => Promise<Seller>;
}

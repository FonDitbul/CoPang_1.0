// seller service domain 생성하기
// interface

import { Seller, TSellerSignUpIn, ISellerSignInIn, ISellerChangeInfoIn } from "./seller";

export interface ISellerService {
  signUp: (sellerSignUpIn: TSellerSignUpIn) => Promise<Seller>;
  signIn: (signInSeller: ISellerSignInIn) => Promise<Seller>;
  signOut: (userId: string) => Promise<boolean>;
  leave: (userId: string) => Promise<Seller>;
  findUser: (userId: string) => Promise<Seller>;
  changeInfo: (changeSeller: ISellerChangeInfoIn) => Promise<Seller>;
}

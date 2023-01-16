import { Seller, TSellerSignUpIn, ISellerSignInIn, ISellerChangeInfoIn, TSellerFindProductIn, ISellerFindProductPaging } from './seller';

export interface ISellerService {
  signUp: (sellerSignUpIn: TSellerSignUpIn) => Promise<Seller>;
  signIn: (signInSeller: ISellerSignInIn) => Promise<Seller>;
  signOut: (userId: string) => Promise<boolean>;
  leave: (userId: string) => Promise<Seller>;
  findUser: (userId: string) => Promise<Seller>;
  changeInfo: (changeSeller: ISellerChangeInfoIn) => Promise<Seller>;
  findProduct: (condition: TSellerFindProductIn) => Promise<ISellerFindProductPaging>;
}

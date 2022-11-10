// seller service domain 생성하기
// interface
import { Seller, TSellerSignUpIn, TSellerFindIn, TSellerFindOut } from './seller';


export interface ISellerService {
  findUserInfo: (seller: TSellerFindIn) => Promise<TSellerFindOut>;
  getOne: (userId: string) => Promise<Seller>;
  getAll: () => Promise<Seller[]>;
  signUp: (sellerSignUpIn: TSellerSignUpIn) => Promise<Seller>;
  delete: (userId: string) => Promise<Seller>;
}

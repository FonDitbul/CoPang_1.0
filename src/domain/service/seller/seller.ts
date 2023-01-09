import { Product } from '../product/product';

export type Seller = {
  id: number;
  userId: string;
  ceoName: string;
  companyName: string;
  password: string;
  deletedAt: Date | null;
};

export type TSellerSignUpIn = Pick<Seller, 'userId' | 'ceoName' | 'companyName' | 'password'>;

export type TSellerSignUpOut = Pick<Seller, 'userId' | 'ceoName' | 'companyName' | 'password'>;

export interface ISellerSignInIn {
  userId: string;
  password: string;
}

export interface ISellerChangeInfoIn {
  originUserId: string;
  originPassword: string;
  ceoName: string;
  companyName: string;
  password: string;
}

export type TSellerChangeInfoOut = Pick<Seller, 'id' | 'userId' | 'ceoName' | 'companyName' | 'password'>;

export interface SellerProduct {
  id: number;
  sellerId: number;
  productId: number;
  price: number;
  count: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  Products?: Product;
}

export type TSellerFindProductIn = {
  sellerId: number;
  sortBy: string;
  order: string;
  pageNum: number;
};

export type TSellerFindProductOut = {
  sellerId: number;
  sortBy: string;
  order: string;
  skip: number;
  take: number;
};

export type TSellerSearchProductIn = TSellerFindProductIn & { text: string };

export type TSellerSearchProductOut = TSellerFindProductOut & { text: string };

export interface ISellerFindProductPaging {
  products: SellerProduct[];
  currentPageNum: number;
  totalPageNum: number;
}

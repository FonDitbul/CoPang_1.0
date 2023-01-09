import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { Seller, SellerProduct } from '../../../domain/service/seller/seller';

export class TSellerSignUpRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  ceoName: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  @Matches('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')
  password: string;
}

export type TSellerSignUpResponse = Pick<Seller, 'userId' | 'ceoName' | 'companyName'>;

export class SellerSignInRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Matches('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')
  password: string;
}

export type TSellerSignInResponse = Pick<Seller, 'id' | 'userId' | 'ceoName' | 'companyName'>;

export type TSellerLeaveResponse = Pick<Seller, 'userId' | 'ceoName' | 'companyName'>;

export type TSellerFindUserResponse = Pick<Seller, 'userId' | 'ceoName' | 'companyName'>;

export class TSellerChangeInfoRequest {
  @IsString()
  @IsNotEmpty()
  ceoName: string;

  @IsString()
  @IsNotEmpty()
  companyName: string;

  @IsString()
  @IsNotEmpty()
  @Matches('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')
  password: string;

  @IsString()
  @IsNotEmpty()
  @Matches('^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$')
  originPassword: string;
}

export type TSellerChangeInfoResponse = Pick<Seller, 'userId' | 'ceoName' | 'companyName'>;

export interface IFindSellerProductResponse {
  products: SellerProduct[];
  currentPageNum: number;
  totalPageNum: number;
}

export interface ISellerSearchProductResponse {
  products: SellerProduct[];
  currentPageNum: number;
  totalPageNum: number;
}

import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { Seller } from '../../../domain/service/seller/seller';

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

export type TSellerSignInResponse = Pick<Seller, 'userId' | 'ceoName' | 'companyName'>;

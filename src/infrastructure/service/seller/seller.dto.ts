import { IsString } from 'class-validator';
import { Seller } from "../../../domain/service/seller/seller";

export class SellerSignUpRequest {
  @IsString()
  userId: string;

  @IsString()
  ceoName: string;

  @IsString()
  companyName: string;

  @IsString()
  password: string;
}

export type SellerSignUpResponse = Pick<Seller, 'userId' | 'ceoName' | 'companyName'>;

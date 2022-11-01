import { IsString, IsInt } from 'class-validator';

export class CreateSellerRequest {
  @IsString()
  userId: string;

  @IsString()
  ceoName: string;

  @IsString()
  companyName: string;

  @IsString()
  password: string;
}

export class SellerSignInIn {
  @IsString()
  userId: string;

  @IsString()
  password: string;
}

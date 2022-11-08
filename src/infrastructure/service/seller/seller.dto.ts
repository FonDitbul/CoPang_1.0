import { IsString, IsNotEmpty } from 'class-validator';

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

export class SellerSignInRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

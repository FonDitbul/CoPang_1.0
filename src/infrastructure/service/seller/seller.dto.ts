import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { Seller } from "../../../domain/service/seller/seller";

export class CreateSellerRequest {
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
  @Matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$")
  password: string;
}

export class FindSellerRequest {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @Matches("^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$")
  password: string;
}

export type FindSellerResponse = Pick<Seller, 'userId' | 'ceoName' | 'companyName'>


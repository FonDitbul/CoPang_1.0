import { IsString, IsInt } from 'class-validator';

export class CreateSellerDto {
  @IsString()
  userId: string;

  @IsString()
  CEOName: string;

  @IsString()
  companyName: string;

  @IsString()
  password: string;
}

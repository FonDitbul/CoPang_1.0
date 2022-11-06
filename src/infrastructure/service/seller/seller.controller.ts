import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post } from '@nestjs/common';
import { SellerSignUpRequest, SellerSignUpResponse } from './seller.dto';
import { Seller, SellerSignUpIn } from '../../../domain/service/seller/seller';
import { ISellerService } from '../../../domain/service/seller/seller.service';

@Controller()
export class SellerController {
  constructor(@Inject('ISellerService') private sellerService: ISellerService) {}

  @Get('/seller')
  async getAll() {
    const allSeller = await this.sellerService.getAll();

    type TSellerResponse = Pick<Seller, 'userId' | 'ceoName' | 'companyName' | 'deletedAt'>;
    const response: TSellerResponse[] = allSeller.map((seller) => {
      return {
        userId: seller.userId,
        ceoName: seller.ceoName,
        companyName: seller.companyName,
        deletedAt: seller.deletedAt,
      };
    });

    return response;
  }

  @Get('/seller/:userId')
  async getOne(@Param('userId') userId: string) {
    const oneSeller = await this.sellerService.getOne(userId);
    if (!oneSeller) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    type TSellerResponse = Pick<Seller, 'userId' | 'ceoName' | 'companyName' | 'deletedAt'>;
    const response: TSellerResponse = {
      userId: oneSeller.userId,
      ceoName: oneSeller.ceoName,
      companyName: oneSeller.companyName,
      deletedAt: oneSeller.deletedAt,
    };

    return response;
  }

  @Post('/seller')
  async signUp(@Body() request: SellerSignUpRequest) {
    const sellerSignUpInbound: SellerSignUpIn = {
      ...request,
    }
    const createdSeller = await this.sellerService.signUp(sellerSignUpInbound);
    const response: SellerSignUpResponse = {
      userId: createdSeller.userId,
      ceoName: createdSeller.ceoName,
      companyName: createdSeller.companyName,
    };
    return response;
  }

  @Delete('/seller/:userId')
  async delete(@Param('userId') userId: string) {
    const oneSeller = await this.sellerService.delete(userId);
    type TSellerResponse = Pick<Seller, 'userId' | 'ceoName' | 'companyName'>;
    const response: TSellerResponse = {
      userId: oneSeller.userId,
      ceoName: oneSeller.ceoName,
      companyName: oneSeller.companyName,
    };
    return response;
  }
}

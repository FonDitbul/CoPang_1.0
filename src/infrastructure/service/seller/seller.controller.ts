import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateSellerRequest, SellerSignInIn } from './seller.dto';
import { Seller } from '../../../domain/service/seller/seller';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { IAuthService } from '../../../domain/service/auth/auth.service';
import { AuthHttpGuard } from '../auth/auth.http.guard';
import { SessionSignInInterceptor, SessionSignOutInterceptor } from '../auth/auth.interceptor.session';

@Controller()
export class SellerController {
  constructor(@Inject('ISellerService') private sellerService: ISellerService, @Inject('IAuthService') private authService: IAuthService) {}

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
  async create(@Body() createSellerRequest: CreateSellerRequest) {
    const oneSeller = await this.sellerService.create(createSellerRequest);
    type TSellerResponse = Pick<Seller, 'userId' | 'ceoName' | 'companyName'>;
    const response: TSellerResponse = {
      userId: oneSeller.userId,
      ceoName: oneSeller.ceoName,
      companyName: oneSeller.companyName,
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

  @Post('/seller/signIn')
  @UseInterceptors(SessionSignInInterceptor)
  async signIn(@Session() session: Record<string, any>, @Body() signInSeller: SellerSignInIn) {
    type TSellerResponse = Pick<Seller, 'userId' | 'ceoName' | 'companyName'>;
    const seller = await this.sellerService.signIn(signInSeller);
    if (!seller) {
      throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
    }

    const response: TSellerResponse = {
      userId: seller.userId,
      ceoName: seller.ceoName,
      companyName: seller.companyName,
    };

    return response;
  }

  @UseGuards(AuthHttpGuard)
  @UseInterceptors(SessionSignOutInterceptor)
  @Post('/seller/signOut')
  async signOut(@Session() session: Record<string, any>) {
    const seller = await this.sellerService.signOut(session.user.userId);
    if (!seller) {
      throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
    }
  }
}

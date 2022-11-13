import { Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { TSellerLeaveResponse, SellerSignInRequest, TSellerSignInResponse, TSellerSignUpRequest, TSellerSignUpResponse } from './seller.dto';
import { TSellerSignUpIn } from '../../../domain/service/seller/seller';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { AuthHttpGuard } from '../auth/auth.http.guard';
import { SessionSignInInterceptor, SessionSignOutInterceptor } from '../auth/auth.interceptor.session';

@Controller()
export class SellerController {
  constructor(@Inject('ISellerService') private sellerService: ISellerService) {}

  @Post('/seller')
  async signUp(@Body() request: TSellerSignUpRequest) {
    const sellerSignUpInbound: TSellerSignUpIn = {
      ...request,
    };
    const createdSeller = await this.sellerService.signUp(sellerSignUpInbound);
    const response: TSellerSignUpResponse = {
      userId: createdSeller.userId,
      ceoName: createdSeller.ceoName,
      companyName: createdSeller.companyName,
    };
    return response;
  }

  @Delete('/seller/:userId')
  async leave(@Param('userId') userId: string) {
    const leavedSeller = await this.sellerService.leave(userId);
    const response: TSellerLeaveResponse = {
      userId: leavedSeller.userId,
      ceoName: leavedSeller.ceoName,
      companyName: leavedSeller.companyName,
    };
    return response;
  }

  @Post('/seller/signIn')
  @UseInterceptors(SessionSignInInterceptor)
  async signIn(@Session() session: Record<string, any>, @Body() signInSellerRequest: SellerSignInRequest) {
    const seller = await this.sellerService.signIn(signInSellerRequest);
    if (!seller) {
      throw new HttpException('UnauthorizedException', HttpStatus.UNAUTHORIZED);
    }

    const response: TSellerSignInResponse = {
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

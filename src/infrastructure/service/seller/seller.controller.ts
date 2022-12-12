import { Body, Controller, Delete, Get, Inject, Param, Post, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { TSellerLeaveResponse, SellerSignInRequest, TSellerSignInResponse, TSellerSignUpRequest, TSellerSignUpResponse, TSellerFindUserResponse, TSellerChangeInfoRequest, TSellerChangeInfoResponse } from './seller.dto';
import { ISellerChangeInfoIn, TSellerSignUpIn } from '../../../domain/service/seller/seller';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { AuthHttpGuard } from '../auth/auth.http.guard';
import { SessionChangeInfoInterceptor, SessionSignInInterceptor, SessionSignOutInterceptor } from '../auth/auth.interceptor.session';

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
    await this.sellerService.signOut(session.user.userId);
  }

  @UseGuards(AuthHttpGuard)
  @Get('/seller/findUser')
  async findUser(@Session() session: Record<string, any>) {
    const seller = await this.sellerService.findUser(session.user.userId);

    const sellerInformation: TSellerFindUserResponse = {
      userId: seller.userId,
      companyName: seller.companyName,
      ceoName: seller.ceoName,
    };

    return sellerInformation;
  }

  @UseGuards(AuthHttpGuard)
  @UseInterceptors(SessionChangeInfoInterceptor)
  @Post('/seller/changeInfo')
  async changeInfo(@Session() session: Record<string, any>, @Body() changeInfoRequest: TSellerChangeInfoRequest) {
    const changeSellerInfoIn: ISellerChangeInfoIn = {
      ...changeInfoRequest,
      originUserId: session.user.userId,
    };

    const seller = await this.sellerService.changeInfo(changeSellerInfoIn);

    const sellerInformation: TSellerChangeInfoResponse = {
      userId: seller.userId,
      companyName: seller.companyName,
      ceoName: seller.ceoName,
    };

    return sellerInformation;
  }
}

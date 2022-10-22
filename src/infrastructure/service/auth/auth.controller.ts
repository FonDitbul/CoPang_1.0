import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { IAuthService } from '../../../domain/service/auth/auth.service';
import { AuthHttpGuard } from './auth.http.guard';

@Controller()
export class AuthController {
  constructor(@Inject('IAuthService') private AuthService: IAuthService) {}

  @UseGuards(AuthHttpGuard)
  @Get('/auth/check')
  async check() {
    type TAuthResponse = {
      message: string;
    };
    const response: TAuthResponse = {
      message: 'check success',
    };

    return response;
  }
}

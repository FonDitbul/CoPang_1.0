import { Module } from '@nestjs/common';
import { AuthService } from '../../../application/service/auth/auth.service';
import { AuthController } from './auth.controller';
import { AuthHttpGuard } from './auth.http.guard';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    AuthHttpGuard,
  ],
})
export class AuthModule {}

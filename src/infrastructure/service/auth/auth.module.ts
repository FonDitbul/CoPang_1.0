import { Module } from '@nestjs/common';
import { AuthService } from '../../../application/service/auth/auth.service';
import { AuthController } from './auth.controller';
import { AuthHttpGuard } from './auth.http.guard';
import { PasswordBcryptEncryptor } from '../../../application/service/auth/encrypt/password.bcrypt.encryptor';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    {
      provide: 'IPasswordEncryptor',
      useClass: PasswordBcryptEncryptor,
    },
    AuthHttpGuard,
  ],
  exports: [
    {
      provide: 'IAuthService',
      useClass: AuthService,
    },
    {
      provide: 'IPasswordEncryptor',
      useClass: PasswordBcryptEncryptor,
    },
    AuthHttpGuard,
  ],
})
export class AuthModule {}

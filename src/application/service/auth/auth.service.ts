import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from '../../../domain/service/auth/auth.service';
import { IPasswordEncryptor } from '../../../domain/service/auth/encrypt/password.encryptor';

@Injectable()
export class AuthService implements IAuthService {
  constructor(@Inject('IPasswordEncryptor') private passwordBcryptEncryptor: IPasswordEncryptor) {}

  async signIn(rawPassword: string, hashedPassword: string): Promise<boolean> {
    const compared = await this.passwordBcryptEncryptor.compare(rawPassword, hashedPassword);
    return compared;
  }
}

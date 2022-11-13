import { Inject, Injectable } from '@nestjs/common';
import { IAuthService } from '../../../domain/service/auth/auth.service';
import { IPasswordEncryptor } from '../../../domain/service/auth/encrypt/password.encryptor';

@Injectable()
export class AuthService implements IAuthService {
  constructor(@Inject('IPasswordEncryptor') private passwordBcryptEncryptor: IPasswordEncryptor) {}

  async signIn(): Promise<any> {
    // TODO 추후 signIn 모듈 개발을 위하여 남겨둡니다 (사실 에러나서 남겨둠)
    return;
  }
}

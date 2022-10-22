import { Injectable } from '@nestjs/common';

import { IAuthService } from '../../../domain/service/auth/auth.service';

@Injectable()
export class AuthService implements IAuthService {
  login(): Promise<void> {
    return;
  }
}

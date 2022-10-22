import { Injectable } from '@nestjs/common';

import { IAuthService } from '../../../domain/service/auth/auth.service';

@Injectable()
export class AuthService implements IAuthService {
  constructor() {}
  login(): Promise<void> {
    return;
  }
}

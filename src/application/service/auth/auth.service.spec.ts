import { IAuthService } from '../../../domain/service/auth/auth.service';
import { AuthService } from './auth.service';

describe('Auth Service test ', () => {
  let testAuthService: IAuthService;

  beforeEach(async () => {
    testAuthService = new AuthService();
  });
});

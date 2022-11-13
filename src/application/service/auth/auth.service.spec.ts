import { IAuthService } from '../../../domain/service/auth/auth.service';
import { AuthService } from './auth.service';
import { PasswordBcryptEncryptor } from './encrypt/password.bcrypt.encryptor';
import { IPasswordEncryptor } from '../../../domain/service/auth/encrypt/password.encryptor';

describe('Auth Service test ', () => {
  let passwordBcryptEncryptor: IPasswordEncryptor;
  let sut: IAuthService;

  beforeEach(async () => {
    passwordBcryptEncryptor = new PasswordBcryptEncryptor();
    sut = new AuthService(passwordBcryptEncryptor);
  });

  describe('auth service test', () => {
    test('test', async () => {
      expect(1).toEqual(1);
    });
  });
});

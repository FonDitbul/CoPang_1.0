import { IAuthService } from '../../../domain/service/auth/auth.service';
import { AuthService } from './auth.service';
import { PasswordBcryptEncryptor } from './encrypt/password.bcrypt.encryptor';
import { IPasswordEncryptor } from '../../../domain/service/auth/encrypt/password.encryptor';

describe('Auth Service test ', () => {
  let passwordBcryptEncryptor: IPasswordEncryptor;
  let testAuthService: IAuthService;

  const givenRawPassword = 'copang';

  beforeEach(async () => {
    passwordBcryptEncryptor = new PasswordBcryptEncryptor();
    testAuthService = new AuthService(passwordBcryptEncryptor);
  });

  describe('auth service test', () => {
    test('test', async () => {
      expect(1).toEqual(1);
    });
  });

  describe('auth sigIn in 메소드 테스트 ', () => {
    test('원본 비밀번호와 해시 함수로 암호화 한 비밀번호가 같은 경우', async () => {
      const givenHashedPassword = await passwordBcryptEncryptor.encrypt(givenRawPassword);

      const actualResult = await passwordBcryptEncryptor.compare(givenRawPassword, givenHashedPassword);

      expect(actualResult).toBeTruthy();
    });

    test('원본 비밀번호와 해시 함수로 암호화 한 비밀번호가 다른 경우', async () => {
      const givenHashedPassword = await passwordBcryptEncryptor.encrypt(givenRawPassword);
      const givenWrongPassword = 'copang1234567';

      const actualResult = await passwordBcryptEncryptor.compare(givenWrongPassword, givenHashedPassword);

      expect(actualResult).toBeFalsy();
    });
  });
});

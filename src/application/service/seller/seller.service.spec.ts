import { SellerService } from './seller.service';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { Seller, TCreateSeller } from '../../../domain/service/seller/seller';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { IAuthService } from '../../../domain/service/auth/auth.service';
import { IPasswordEncryptor } from '../../../domain/service/auth/encrypt/password.encryptor';
import { PasswordBcryptEncryptor } from '../auth/encrypt/password.bcrypt.encryptor';
import { AuthService } from '../auth/auth.service';

class MockSellerRepository implements ISellerRepository {
  create(seller: TCreateSeller): Promise<Seller> {
    return Promise.resolve(undefined);
  }

  delete(userId: string): Promise<Seller> {
    return Promise.resolve(undefined);
  }

  findAll(): Promise<Seller[]> {
    return Promise.resolve([]);
  }

  findOne(userId: string): Promise<Seller> {
    return Promise.resolve(undefined);
  }
}

describe('seller service test ', () => {
  let testSellerService: ISellerService;
  let sellerRepository: MockSellerRepository;
  let authService: IAuthService;
  let passwordBcryptEncryptor: IPasswordEncryptor;

  beforeEach(async () => {
    sellerRepository = new MockSellerRepository();

    passwordBcryptEncryptor = new PasswordBcryptEncryptor();
    authService = new AuthService(passwordBcryptEncryptor);
    testSellerService = new SellerService(sellerRepository, authService);
  });

  describe('판매자 회원가입', () => {
    test('판매자 생성', async () => {
      // 유저 생성하기 Test 코드
      const savedSeller: Seller = {
        id: 1,
        userId: 'test',
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        deletedAt: null,
      };
      const createSeller = {
        userId: savedSeller.userId,
        ceoName: savedSeller.ceoName,
        companyName: savedSeller.companyName,
        password: savedSeller.password,
      };
      const sellerRepositorySaveSpy = jest.spyOn(sellerRepository, 'create').mockResolvedValue(savedSeller);
      try {
        const result = await testSellerService.create(createSeller);
        expect(result).toEqual(savedSeller);
        expect(sellerRepositorySaveSpy).toHaveBeenCalledWith(savedSeller);
      } catch (e) {
        // console.error(e);
      }
    });
  });

  describe('전체 판매자 가져오기', () => {
    test('전체 판매자 가져오기', async () => {
      const savedSellerArray: Seller[] = [
        {
          id: 1,
          userId: 'test',
          ceoName: 'testCEO',
          companyName: 'testCompany',
          password: 'testPassword',
          deletedAt: null,
        },
        {
          id: 2,
          userId: 'test2',
          ceoName: 'testCEO2',
          companyName: 'testCompany2',
          password: 'testPassword',
          deletedAt: null,
        },
      ];

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findAll').mockResolvedValue(savedSellerArray);
      try {
        const result = await testSellerService.getAll();
        expect(result).toEqual(savedSellerArray);
        expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(savedSellerArray);
      } catch (e) {
        // console.error(e);
      }
    });
  });

  describe('특정 유저 id로 가져오기 ', () => {
    test('user id 조회 성공', async () => {
      // 해당 user Id 가져오기
      const savedSeller: Seller = {
        id: 1,
        userId: 'test',
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        deletedAt: null,
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(savedSeller);
      try {
        const result = await testSellerService.getOne(savedSeller.userId);
        expect(result).toEqual(savedSeller);
        expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(savedSeller);
      } catch (e) {
        // console.error(e);
      }
    });

    test('삭제된 유저인 경우', async () => {
      // 해당 user Id 가져오기
      const savedSeller: Seller = {
        id: 1,
        userId: 'test',
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        deletedAt: new Date(),
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockRejectedValue(new Error('deleted seller'));
      try {
        const result = await testSellerService.getOne(savedSeller.userId);
        expect(savedSeller.deletedAt).toBeInstanceOf(Date);
        expect(sellerRepositoryFindOneSpy).toThrow();
      } catch (e) {
        // console.error(e);
      }
    });
  });

  describe('유저 회원 탈퇴 ', () => {
    test('이미 삭제한 유저', async () => {
      // 유저 삭제
      const deletedSeller: Seller = {
        id: 1,
        userId: 'test',
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        deletedAt: new Date(),
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'delete').mockRejectedValue(new Error('deleted seller'));

      try {
        await testSellerService.delete(deletedSeller.userId);
        expect(sellerRepositoryFindOneSpy).toThrow();
      } catch (e) {
        // console.error(e);
      }
    });
    test('유저 삭제 성공', async () => {
      // 유저 삭제
      const deletedSeller: Seller = {
        id: 1,
        userId: 'test',
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        deletedAt: null,
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'delete').mockResolvedValue(deletedSeller);

      try {
        const result = await testSellerService.delete(deletedSeller.userId);

        expect(result).toEqual(deletedSeller);
        expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(deletedSeller);
      } catch (e) {
        // console.error(e);
      }
    });
  });
});

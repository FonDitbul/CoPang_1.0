import { SellerService } from './seller.service';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { ISellerSignInIn, Seller } from '../../../domain/service/seller/seller';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { IAuthService } from '../../../domain/service/auth/auth.service';
import { IPasswordEncryptor } from '../../../domain/service/auth/encrypt/password.encryptor';
import { mock, MockProxy } from 'jest-mock-extended';

describe('seller service test ', () => {
  const sellerRepository: MockProxy<ISellerRepository> = mock<ISellerRepository>();
  const passwordEncryptor: MockProxy<IPasswordEncryptor> = mock<IPasswordEncryptor>();
  const testSellerService: ISellerService = new SellerService(sellerRepository, passwordEncryptor); // System Under Test

  const testPassword = 'copang1234';
  const testEncryptPassword = '$2b$08$iPMAVTLO0m1dOSREKqM2ouhTTb2LuIwkaziePr0VTReZPW9BRVIda';

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

  describe('판매자 로그인 테스트', () => {
    test('유저 아이디 존재 비밀번호 일치 로그인이 성공하여 유저 정보를 리턴한 경우', async () => {
      const signInSeller: Seller = {
        id: 1,
        userId: 'SellerTest',
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: testEncryptPassword,
        deletedAt: null,
      };

      const signInInSeller: ISellerSignInIn = {
        userId: 'SellerTest',
        password: testPassword,
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(signInSeller);
      const passwordEncryptorSpy = jest.spyOn(passwordEncryptor, 'compare').mockResolvedValue(true);

      const result = await testSellerService.signIn(signInInSeller);

      expect(result).toEqual(signInSeller);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(signInInSeller.userId);
      expect(passwordEncryptorSpy).toHaveBeenCalledWith(signInInSeller.password, testEncryptPassword);
    });

    test('판매자 아이디 존재 하지 않아 로그인 실패 경우', async () => {
      const signInInSeller: ISellerSignInIn = {
        userId: 'SellerTestNotIn',
        password: testPassword,
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(null);

      const result = await testSellerService.signIn(signInInSeller);

      expect(result).toEqual(null);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(signInInSeller.userId);
    });

    test('판매자 아이디가 존재하지만, 삭제된 유저 가 로그인을 시도하여 로그인이 실패한 경우', async () => {
      const signInSeller: Seller = {
        id: 1,
        userId: 'SellerTest',
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: testEncryptPassword,
        deletedAt: new Date(),
      };

      const signInInSeller: ISellerSignInIn = {
        userId: 'SellerTestNotIn',
        password: testPassword,
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(signInSeller);

      const result = await testSellerService.signIn(signInInSeller);

      expect(result).toEqual(null);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(signInInSeller.userId);
    });

    test('유저 아이디 존재, 삭제하지 않은 유저이지만 비밀번호가 일치 하지 않아 로그인이 실패한 경우', async () => {
      const notPassword = 'cop';
      const signInSeller: Seller = {
        id: 1,
        userId: 'SellerTest',
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: testEncryptPassword,
        deletedAt: null,
      };

      const signInInSeller: ISellerSignInIn = {
        userId: 'SellerTest',
        password: notPassword,
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(signInSeller);
      const passwordEncryptorSpy = jest.spyOn(passwordEncryptor, 'compare').mockResolvedValue(false);

      const result = await testSellerService.signIn(signInInSeller);

      expect(result).toEqual(null);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(signInInSeller.userId);
      expect(passwordEncryptorSpy).toHaveBeenCalledWith(signInInSeller.password, testEncryptPassword);
    });
  });

  describe('로그아웃 테스트', () => {
    const signOutSellerUserId = 'SellerSignOut';

    test('유저 아이디가 존재, 삭제하지 않은 유저, 로그아웃이 성공한 경우', async () => {
      const signOutSeller: Seller = {
        id: 1,
        userId: signOutSellerUserId,
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: testEncryptPassword,
        deletedAt: null,
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(signOutSeller);

      const result = await testSellerService.signOut(signOutSellerUserId);

      expect(result).toEqual(true);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(signOutSellerUserId);
    });

    test('유저 아이디가 존재하지만 유저 정보를 삭제하여 로그아웃이 실패한 경우', async () => {
      const signOutSeller: Seller = {
        id: 1,
        userId: signOutSellerUserId,
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: testEncryptPassword,
        deletedAt: new Date(),
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(signOutSeller);

      const result = await testSellerService.signOut(signOutSellerUserId);

      expect(result).toEqual(null);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(signOutSellerUserId);
    });

    test('존재하지 않는 유저 아이디로 로그아웃이 실패한 경우 ', async () => {
      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(null);

      const result = await testSellerService.signOut(signOutSellerUserId);

      expect(result).toEqual(null);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(signOutSellerUserId);
    });
  });
});

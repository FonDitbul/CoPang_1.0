import { MockProxy, mock, any } from 'jest-mock-extended'
import { SellerService } from './seller.service';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { Seller } from '../../../domain/service/seller/seller';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { IPasswordEncryptor } from "../../../domain/service/auth/encrypt/password.encryptor";

describe('seller service test ', () => {
  const sellerRepository: MockProxy<ISellerRepository> = mock<ISellerRepository>();
  const passwordEncryptor: MockProxy<IPasswordEncryptor> = mock<IPasswordEncryptor>();
  const sut: ISellerService = new SellerService(sellerRepository, passwordEncryptor); // System Under Test

  const givenSeller: Seller = {
    id: 1,
    userId: 'test',
    ceoName: 'testCEO',
    companyName: 'testCompany',
    password: 'testPassword',
    deletedAt: null,
  }

  describe('판매자 회원가입 테스트', () => {
    const givenSignInSeller = {
      userId: givenSeller.userId,
      ceoName: givenSeller.ceoName,
      companyName: givenSeller.companyName,
      password: givenSeller.password,
    }

    test('주어진 아이디로 이미 회원가입한 판매자가 존재할 경우 에러가 발생한다.', async () => {
      sellerRepository.findOne.calledWith(givenSeller.userId).mockResolvedValue(givenSeller);

      try {
        await sut.signUp(givenSignInSeller);
      } catch (e) {
        expect(e.message).toEqual("이미 등록된 판매자 아이디");
      }
    });

    test('주어진 아이디로 회원가입한 판매자가 존재하지 않을 경우 비밀번호가 암호화되어 정상적으로 등록된다.', async () => {
      const givenEncryptedPassword = "someEncryptedPassword"
      sellerRepository.findOne.calledWith(givenSeller.userId).mockResolvedValue(null);
      sellerRepository.signUp.calledWith(any()).mockResolvedValue(givenSeller);
      passwordEncryptor.encrypt.calledWith(any()).mockResolvedValue(givenEncryptedPassword)
      const expectedSavedSeller = {
        ...givenSignInSeller,
        password: givenEncryptedPassword
      }

      const actualSeller = await sut.signUp(givenSignInSeller);

      expect(sellerRepository.signUp).toHaveBeenCalledWith(expectedSavedSeller);
      expect(actualSeller.userId).toEqual(givenSeller.userId);
      expect(actualSeller.ceoName).toEqual(givenSeller.ceoName);
      expect(actualSeller.companyName).toEqual(givenSeller.companyName);
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
        const result = await sut.getAll();
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

      const sellerRepositoryFindOneSpy = sellerRepository.findOne.calledWith(savedSeller.userId).mockResolvedValue(savedSeller);
      try {
        const result = await sut.getOne(savedSeller.userId);
        expect(result).toEqual(savedSeller);
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

      const sellerRepositoryFindOneSpy = sellerRepository.findOne.calledWith(savedSeller.userId).mockResolvedValue(savedSeller);
      try {
        const result = await sut.getOne(savedSeller.userId);
        expect(savedSeller.deletedAt).toBeInstanceOf(Date);
        expect(sellerRepositoryFindOneSpy).toThrow();
      } catch (e) {
        // console.error(e);
      }
    });
  });

  describe('판매자 회원 탈퇴 테스트', () => {

    test('아이디로 판매자를 조회했을 때 판매자 정보가 존재하지 않으면 에러를 던진다.', async () => {
      const givenNoSellerUserId = "noSellerId"

      sellerRepository.findOne.calledWith(givenNoSellerUserId).mockResolvedValue(null);

      try {
        await sut.leave(givenNoSellerUserId);
      } catch (e) {
        expect(e.message).toEqual("판매자 아이디에 해당하는 판매자 정보 존재하지 않음");
      }
    });

    test('아이디로 판매자를 조회했을 때 삭제 일자가 존재한다면, 이미 탈퇴한 판매자이므로 에러를 던진다.', async () => {
      const givenSellerUserId = givenSeller.userId;

      const deletedSeller: Seller = {
        ...givenSeller,
        deletedAt: new Date(),
      };

      sellerRepository.findOne.calledWith(givenSellerUserId).mockResolvedValue(deletedSeller);

      try {
        await sut.leave(deletedSeller.userId);
      } catch (e) {
        expect(e.message).toEqual("이미 삭제된 판매자");
      }
    });

    test('아이디로 판매자를 조회했을 때 삭제 일자가 존재하지 않는다면 삭제 처리를 진행하고 삭제 일자가 저장된다', async () => {
      const givenSellerUserId = givenSeller.userId;

      const notDeletedSeller: Seller = {
        ...givenSeller,
        deletedAt: null,
      };
      sellerRepository.findOne.calledWith(givenSellerUserId).mockResolvedValue(notDeletedSeller);

      const afterDeletedSeller: Seller = {
        ...givenSeller,
        deletedAt: new Date(),
      };
      sellerRepository.delete.calledWith(givenSellerUserId).mockResolvedValue(afterDeletedSeller);

      const actualResult = await sut.leave(notDeletedSeller.userId);

      expect(actualResult.deletedAt).not.toBeNull()
    });
  });
});

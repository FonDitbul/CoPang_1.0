import { MockProxy, mock, any } from 'jest-mock-extended';
import { SellerService } from './seller.service';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import {
  Seller,
  ISellerSignInIn,
  ISellerChangeInfoIn,
  TSellerChangeInfoOut
} from '../../../domain/service/seller/seller';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { IPasswordEncryptor } from '../../../domain/service/auth/encrypt/password.encryptor';

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
  };

  const testPassword = 'copang1234';
  const testEncryptPassword = '$2b$08$iPMAVTLO0m1dOSREKqM2ouhTTb2LuIwkaziePr0VTReZPW9BRVIda';

  describe('판매자 회원가입 테스트', () => {
    const givenSignInSeller = {
      userId: givenSeller.userId,
      ceoName: givenSeller.ceoName,
      companyName: givenSeller.companyName,
      password: givenSeller.password,
    };

    test('주어진 아이디로 이미 회원가입한 판매자가 존재할 경우 에러가 발생한다.', async () => {
      sellerRepository.findOne.calledWith(givenSeller.userId).mockResolvedValue(givenSeller);

      await expect(async () => {
        await sut.signUp(givenSignInSeller);
      }).rejects.toThrowError(new Error('이미 등록된 판매자 아이디'));
    });

    test('주어진 아이디로 회원가입한 판매자가 존재하지 않을 경우 비밀번호가 암호화되어 정상적으로 등록된다.', async () => {
      const givenEncryptedPassword = 'someEncryptedPassword';
      sellerRepository.findOne.calledWith(givenSeller.userId).mockResolvedValue(null);
      sellerRepository.signUp.calledWith(any()).mockResolvedValue(givenSeller);
      passwordEncryptor.encrypt.calledWith(any()).mockResolvedValue(givenEncryptedPassword);
      const expectedSavedSeller = {
        ...givenSignInSeller,
        password: givenEncryptedPassword,
      };

      const actualSeller = await sut.signUp(givenSignInSeller);

      expect(sellerRepository.signUp).toHaveBeenCalledWith(expectedSavedSeller);
      expect(actualSeller.userId).toEqual(givenSeller.userId);
      expect(actualSeller.ceoName).toEqual(givenSeller.ceoName);
      expect(actualSeller.companyName).toEqual(givenSeller.companyName);
    });
  });

  describe('판매자 회원 탈퇴 테스트', () => {
    test('아이디로 판매자를 조회했을 때 판매자 정보가 존재하지 않으면 에러를 던진다.', async () => {
      const givenNoSellerUserId = 'noSellerId';

      sellerRepository.findOne.calledWith(givenNoSellerUserId).mockResolvedValue(null);

      await expect(async () => {
        await sut.leave(givenNoSellerUserId);
      }).rejects.toThrowError(new Error('판매자 아이디에 해당하는 판매자 정보 존재하지 않음'));
    });

    test('아이디로 판매자를 조회했을 때 삭제 일자가 존재한다면, 이미 탈퇴한 판매자이므로 에러를 던진다.', async () => {
      const givenSellerUserId = givenSeller.userId;

      const deletedSeller: Seller = {
        ...givenSeller,
        deletedAt: new Date(),
      };

      sellerRepository.findOne.calledWith(givenSellerUserId).mockResolvedValue(deletedSeller);

      await expect(async () => {
        await sut.leave(deletedSeller.userId);
      }).rejects.toThrowError(new Error('이미 삭제된 판매자'));
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

      expect(actualResult.deletedAt).not.toBeNull();
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

      const result = await sut.signIn(signInInSeller);

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

      const result = await sut.signIn(signInInSeller);

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

      const result = await sut.signIn(signInInSeller);

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

      const result = await sut.signIn(signInInSeller);

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

      const result = await sut.signOut(signOutSellerUserId);

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

      const result = await sut.signOut(signOutSellerUserId);

      expect(result).toEqual(null);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(signOutSellerUserId);
    });

    test('존재하지 않는 유저 아이디로 로그아웃이 실패한 경우 ', async () => {
      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(null);

      const result = await sut.signOut(signOutSellerUserId);

      expect(result).toEqual(null);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(signOutSellerUserId);
    });
  });

  describe('판매자 유저 정보 찾기 테스트', () => {
    const findUserId = 'test'

    test('정상적으로 정보를 찾았을 때', async () => {
      const foundSeller: Seller = {
        id: 1,
        userId: findUserId,
        ceoName: 'test',
        companyName: 'CoPang',
        password: testEncryptPassword,
        deletedAt: null
      }
      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(foundSeller);

      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(findUserId);
    });

    test('삭제된 유저의 정보를 찾았을 때', async () => {
      const foundDeletedSeller: Seller = {
        id: 1,
        userId: findUserId,
        ceoName: 'test',
        companyName: 'CoPang',
        password: testEncryptPassword,
        deletedAt: new Date()
      }

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(foundDeletedSeller);
      const result = await sut.findUser(findUserId);

      expect(result).toEqual(null);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(findUserId);
    });

    test('없는 유저의 정보를 찾았을 때', async () => {
      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(null);
      const result = await sut.findUser(findUserId);

      expect(result).toEqual(null);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(findUserId);
    });
  });

  describe('판매자 유저 수정하기 테스트', () => {
    const originSeller: Seller = {
      id: 1,
      userId: 'test',
      ceoName: 'originCeo',
      companyName: 'CoPang',
      password: testEncryptPassword,
      deletedAt: null
    }

    const changedSeller: Seller = {
      id: 1,
      userId: 'changedId',
      ceoName: 'changedCeo',
      companyName: 'CoPang',
      password: testEncryptPassword,
      deletedAt: null
    }

    test('정상적으로 정보를 수정했을 때', async () => {
      const changeInfoIn: ISellerChangeInfoIn = {
        originUserId: 'test',
        originPassword: 'somePassword',
        userId: 'changedId',
        ceoName: 'changedCeo',
        companyName: 'CoPang',
        password: testPassword
      }

      const sellerChangeInfoOut: TSellerChangeInfoOut = {
        ...changeInfoIn,
        id: 1,
        password: testEncryptPassword
      }

      passwordEncryptor.encrypt.calledWith(any()).mockResolvedValue(testEncryptPassword);

      const passwordEncryptorSpy = jest.spyOn(passwordEncryptor, 'compare').mockResolvedValue(true);
      const sellerRepositoryUpdateSpy = jest.spyOn(sellerRepository, 'update').mockResolvedValue(changedSeller);
      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne')
        .mockResolvedValueOnce(originSeller).mockResolvedValue(null);
      const result = await sut.changeInfo(changeInfoIn)

      expect(result).toEqual(changedSeller)
      expect(sellerRepositoryUpdateSpy).toHaveBeenCalledWith(sellerChangeInfoOut);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(changedSeller.userId);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(originSeller.userId);
      expect(passwordEncryptorSpy).toHaveBeenCalledWith(changeInfoIn.password, testEncryptPassword);
    });

    test('이미 존재하는 유저의 아이디로 변경을 시도했을 때', async () => {
      const someSeller: Seller = {
        id: 2,
        userId: 'someId',
        ceoName: 'someCEO',
        companyName: 'CoPang',
        password: testEncryptPassword,
        deletedAt: null
      }

      const changeInfoIn: ISellerChangeInfoIn = {
        originUserId: 'test',
        originPassword: 'somePassword',
        userId: 'someId',
        ceoName: 'guyCEO',
        companyName: 'CoPang',
        password: testPassword
      }

      passwordEncryptor.encrypt.calledWith(any()).mockResolvedValue(testEncryptPassword);
      jest.spyOn(sellerRepository, 'update').mockResolvedValue(changedSeller);

      const passwordEncryptorSpy = jest.spyOn(passwordEncryptor, 'compare').mockResolvedValue(true);
      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne')
        .mockResolvedValueOnce(originSeller).mockResolvedValue(someSeller);

      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(changedSeller.userId);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(originSeller.userId);
      expect(passwordEncryptorSpy).toHaveBeenCalledWith(changeInfoIn.password, testEncryptPassword);

      await expect(async () => {
        await sut.changeInfo(changeInfoIn);
      }).rejects.toThrowError(new Error('이미 존재하는 유저 아이디 입니다.'));
    });


    test('비밀번호를 잘못 입력했을 때', async () => {
      const changeInfoIn: ISellerChangeInfoIn = {
        originUserId: 'test',
        originPassword: 'somePassword',
        userId: 'someId',
        ceoName: 'guyCEO',
        companyName: 'CoPang',
        password: testPassword
      }

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne')
        .mockResolvedValueOnce(originSeller).mockResolvedValue(null);

      passwordEncryptor.encrypt.calledWith(any()).mockResolvedValue(testEncryptPassword);

      const passwordEncryptorSpy = jest.spyOn(passwordEncryptor, 'compare').mockResolvedValue(false);

      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(changedSeller.userId);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(originSeller.userId);
      expect(passwordEncryptorSpy).toHaveBeenCalledWith(changeInfoIn.password, testEncryptPassword);

      const result = await sut.changeInfo(changeInfoIn)
      expect(result).toEqual(null)
    });
  });
});

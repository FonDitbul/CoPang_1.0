import { MockProxy, mock, any } from 'jest-mock-extended';
import { SellerService } from './seller.service';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { IProductRepository } from '../../../domain/service/product/product.repository';
import {
  Seller,
  ISellerSignInIn,
  ISellerChangeInfoIn,
  TSellerChangeInfoOut,
  TSellerFindProductIn,
  TSellerSearchProductIn,
  SellerProduct,
} from '../../../domain/service/seller/seller';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { IPasswordEncryptor } from '../../../domain/service/auth/encrypt/password.encryptor';
import { CoPangException, EXCEPTION_STATUS } from '../../../domain/common/exception';

describe('seller service test ', () => {
  const sellerRepository: MockProxy<ISellerRepository> = mock<ISellerRepository>();
  const productRepository: MockProxy<IProductRepository> = mock<IProductRepository>();
  const passwordEncryptor: MockProxy<IPasswordEncryptor> = mock<IPasswordEncryptor>();
  const sut: ISellerService = new SellerService(sellerRepository, productRepository, passwordEncryptor); // System Under Test

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
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.USER_ID_DUPLICATE));
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
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.USER_NOT_EXIST));
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
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.USER_DELETED));
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

      await expect(async () => {
        await sut.signIn(signInInSeller);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.USER_NOT_EXIST));

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

      await expect(async () => {
        await sut.signIn(signInInSeller);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.USER_DELETED));

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

      await expect(async () => {
        await sut.signIn(signInInSeller);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.USER_PASSWORD_NOT_MATCH));

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

      await expect(async () => {
        await sut.signOut(signOutSellerUserId);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.USER_DELETED));

      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(signOutSellerUserId);
    });

    test('존재하지 않는 유저 아이디로 로그아웃이 실패한 경우 ', async () => {
      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(null);

      await expect(async () => {
        await sut.signOut(signOutSellerUserId);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.USER_NOT_EXIST));

      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(signOutSellerUserId);
    });
  });

  describe('판매자 유저 정보 찾기 테스트', () => {
    const findUserId = 'test';

    test('세션에 저장된 유저 정보가 존재하고, 삭제되지 않은 유저라면 해당 유저 정보를 반환한다.', async () => {
      const foundSeller: Seller = {
        id: 1,
        userId: findUserId,
        ceoName: 'test',
        companyName: 'CoPang',
        password: testEncryptPassword,
        deletedAt: null,
      };
      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(foundSeller);
      const result = await sut.findUser(findUserId);

      expect(result).toEqual(foundSeller);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(findUserId);
    });

    test('세션에 저장된 유저 정보가 존재하지만, 삭제된 유저일 경우 에러를 반환한다.', async () => {
      const foundDeletedSeller: Seller = {
        id: 1,
        userId: findUserId,
        ceoName: 'test',
        companyName: 'CoPang',
        password: testEncryptPassword,
        deletedAt: new Date(),
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(foundDeletedSeller);

      await expect(async () => {
        await sut.findUser(findUserId);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.USER_DELETED));

      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(findUserId);
    });

    test('세션에 저장된 유저 정보가 있지만, 조회된 유저가 없을 때 에러를 반환한다.', async () => {
      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(null);

      await expect(async () => {
        await sut.findUser(findUserId);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.USER_NOT_EXIST));

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
      deletedAt: null,
    };

    const changedSeller: Seller = {
      id: 1,
      userId: 'test',
      ceoName: 'changedCeo',
      companyName: 'CoPang',
      password: testEncryptPassword,
      deletedAt: null,
    };

    test('비밀번호를 올바르게 입력하고, 올바른 변경값을 보내 유저 정보를 변경하고 변경된 유저 정보를 반환한다.', async () => {
      const changeInfoIn: ISellerChangeInfoIn = {
        originUserId: 'test',
        originPassword: 'somePassword',
        ceoName: 'changedCeo',
        companyName: 'CoPang',
        password: testPassword,
      };

      const sellerChangeInfoOut: TSellerChangeInfoOut = {
        ...changeInfoIn,
        userId: 'test',
        id: 1,
        password: testEncryptPassword,
      };

      passwordEncryptor.encrypt.calledWith(any()).mockResolvedValue(testEncryptPassword);

      const passwordEncryptorSpy = jest.spyOn(passwordEncryptor, 'compare').mockResolvedValue(true);
      const sellerRepositoryUpdateSpy = jest.spyOn(sellerRepository, 'update').mockResolvedValue(changedSeller);
      const sellerRepositoryFindOneSpy = jest
        .spyOn(sellerRepository, 'findOne')
        .mockResolvedValueOnce(originSeller)
        .mockResolvedValue(null);
      const result = await sut.changeInfo(changeInfoIn);

      expect(result).toEqual(changedSeller);
      expect(sellerRepositoryUpdateSpy).toHaveBeenCalledWith(sellerChangeInfoOut);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(changedSeller.userId);
      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(originSeller.userId);
      expect(passwordEncryptorSpy).toHaveBeenCalledWith(changeInfoIn.password, testEncryptPassword);
    });

    test('비밀번호를 올바르게 입력하지 않아 에러를 반환한다.', async () => {
      const changeInfoIn: ISellerChangeInfoIn = {
        originUserId: 'test',
        originPassword: 'somePassword',
        ceoName: 'guyCEO',
        companyName: 'CoPang',
        password: testPassword,
      };

      const sellerRepositoryFindOneSpy = jest
        .spyOn(sellerRepository, 'findOne')
        .mockResolvedValueOnce(originSeller)
        .mockResolvedValue(null);

      passwordEncryptor.encrypt.calledWith(any()).mockResolvedValue(testEncryptPassword);

      const passwordEncryptorSpy = jest.spyOn(passwordEncryptor, 'compare').mockResolvedValue(false);

      expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(originSeller.userId);
      expect(passwordEncryptorSpy).toHaveBeenCalledWith(changeInfoIn.password, testEncryptPassword);

      await expect(async () => {
        await sut.changeInfo(changeInfoIn);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.USER_PASSWORD_NOT_MATCH));
    });
  });

  describe('판매자 물품 조회', () => {
    test('판매자가 물품 조회를 성공했을 경우', async () => {
      const successCondition: TSellerFindProductIn = {
        sellerId: 1,
        order: 'asc',
        sortBy: 'id',
        pageNum: 1,
      };

      const products: SellerProduct[] = [
        {
          id: 1,
          sellerId: 1,
          productId: 1,
          price: 1000,
          count: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      jest.spyOn(productRepository, 'findAllWithSellerAndCount').mockResolvedValue([products.length, products]);

      const result = await sut.findProduct(successCondition);

      await expect(result.currentPageNum).toEqual(successCondition.pageNum);
      await expect(result.totalPageNum).toEqual(Math.round(successCondition.pageNum / 20) + 1);
    });

    test('판매자가 물품 조회시 order에 잘못된 값을 기입하여 실패한 경우', async () => {
      const failCondition: TSellerFindProductIn = {
        sellerId: 1,
        order: 'ascError',
        sortBy: 'id',
        pageNum: 1,
      };

      await expect(async () => {
        await sut.findProduct(failCondition);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.PAGING_ORDER_OPTION_ERROR));
    });

    test('판매자가 물품 조회시 sortBy에 잘못된 값을 기입하여 실패한 경우', async () => {
      const failCondition: TSellerFindProductIn = {
        sellerId: 1,
        order: 'desc',
        sortBy: 'iderror',
        pageNum: 1,
      };

      await expect(async () => {
        await sut.findProduct(failCondition);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.PAGING_SORT_BY_OPTION_ERROR));
    });

    test('판매자가 물품 조회시 pageNum이 0을 입력하여 실패한 경우', async () => {
      const failCondition: TSellerFindProductIn = {
        sellerId: 1,
        order: 'desc',
        sortBy: 'id',
        pageNum: 0,
      };

      await expect(async () => {
        await sut.findProduct(failCondition);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.PAGING_NUM_ERROR));
    });

    test('판매자가 물품 조회시 현재 페이지 숫자가 전체 페이지 수 보다 커서 실패한 경우', async () => {
      const failCondition: TSellerFindProductIn = {
        sellerId: 1,
        order: 'desc',
        sortBy: 'id',
        pageNum: 2,
      };

      const products: SellerProduct[] = [
        {
          id: 1,
          sellerId: 1,
          productId: 1,
          price: 1000,
          count: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      jest.spyOn(productRepository, 'findAllWithSellerAndCount').mockResolvedValue([products.length, products]);

      await expect(async () => {
        await sut.findProduct(failCondition);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.PAGING_NUM_ERROR));
    });
  });

  describe('판매자 물품 검색 조회', () => {
    test('판매자가 물품 조회를 성공했을 경우', async () => {
      const successCondition: TSellerSearchProductIn = {
        sellerId: 1,
        text: '노트북',
        order: 'asc',
        sortBy: 'id',
        pageNum: 1,
      };

      const products: SellerProduct[] = [
        {
          id: 1,
          sellerId: 1,
          productId: 1,
          price: 1000,
          count: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      jest.spyOn(productRepository, 'findSearchWithSellerAndCount').mockResolvedValue([products.length, products]);

      const result = await sut.searchProduct(successCondition);

      await expect(result.currentPageNum).toEqual(successCondition.pageNum);
      await expect(result.totalPageNum).toEqual(Math.round(successCondition.pageNum / 20) + 1);
    });

    test('판매자가 물품 조회시 text에 아무것도 입력하지 않았을 경우', async () => {
      const failCondition: TSellerSearchProductIn = {
        sellerId: 1,
        text: '',
        order: 'asc',
        sortBy: 'id',
        pageNum: 1,
      };

      await expect(async () => {
        await sut.searchProduct(failCondition);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.SEARCH_STRING_EMPTY));
    });

    test('판매자가 물품 조회시 order에 잘못된 값을 기입하여 실패한 경우', async () => {
      const failCondition: TSellerSearchProductIn = {
        sellerId: 1,
        text: '노트북',
        order: 'ascError',
        sortBy: 'id',
        pageNum: 1,
      };

      await expect(async () => {
        await sut.searchProduct(failCondition);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.PAGING_ORDER_OPTION_ERROR));
    });

    test('판매자가 물품 조회시 sortBy에 잘못된 값을 기입하여 실패한 경우', async () => {
      const failCondition: TSellerSearchProductIn = {
        sellerId: 1,
        text: '노트북',
        order: 'desc',
        sortBy: 'iderror',
        pageNum: 1,
      };

      await expect(async () => {
        await sut.searchProduct(failCondition);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.PAGING_SORT_BY_OPTION_ERROR));
    });

    test('판매자가 물품 조회시 pageNum이 0을 입력하여 실패한 경우', async () => {
      const failCondition: TSellerSearchProductIn = {
        sellerId: 1,
        text: '노트북',
        order: 'desc',
        sortBy: 'id',
        pageNum: 0,
      };

      await expect(async () => {
        await sut.searchProduct(failCondition);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.PAGING_NUM_ERROR));
    });

    test('판매자가 물품 조회시 현재 페이지 숫자가 전체 페이지 수 보다 커서 실패한 경우', async () => {
      const failCondition: TSellerSearchProductIn = {
        sellerId: 1,
        text: '노트북',
        order: 'desc',
        sortBy: 'id',
        pageNum: 2,
      };

      const products: SellerProduct[] = [
        {
          id: 1,
          sellerId: 1,
          productId: 1,
          price: 1000,
          count: 50,
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];
      jest.spyOn(productRepository, 'findAllWithSellerAndCount').mockResolvedValue([products.length, products]);

      await expect(async () => {
        await sut.searchProduct(failCondition);
      }).rejects.toThrowError(new CoPangException(EXCEPTION_STATUS.PAGING_NUM_ERROR));
    });
  });
});

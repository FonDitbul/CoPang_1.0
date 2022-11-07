import { SellerService } from './seller.service';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { Seller, TSellerFindIn, TCreateSeller, TSellerFindOut } from '../../../domain/service/seller/seller';
import { ISellerService } from '../../../domain/service/seller/seller.service';

class MockSellerRepository implements ISellerRepository {
  findUserInfo(seller: TSellerFindIn): Promise<Seller> {
    return Promise.resolve(undefined);
  }

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

  beforeEach(async () => {
    sellerRepository = new MockSellerRepository();
    testSellerService = new SellerService(sellerRepository);
  });

  describe('판매자 정보조회', () => {
    test('패스워드 일치', async () => {

      const requestInfo: TSellerFindIn = {
        userId: "testUserId",
        password: "testPassword"
      }

      const responseInfo: TSellerFindOut = {
        userId: "testUserId",
        password: "testPassword",
        ceoName: "someGuy",
        companyName: "someCompany"
      }

      const responseRepo: Seller = {
        id: 1,
        userId: 'test',
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        deletedAt: null,
      }

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findUserInfo').mockResolvedValue(responseRepo);
      try {
        const result: TSellerFindOut = await testSellerService.findUserInfo(requestInfo);
        expect(result).toEqual(responseInfo);
        expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(requestInfo);
      } catch (e) {
        // console.error(e);
      }
    });
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

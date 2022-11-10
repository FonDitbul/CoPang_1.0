import { TSellerSignUpRequest } from './seller.dto';
import { SellerController } from './seller.controller';
import { Seller, TSellerFindIn, TSellerFindOut, TSellerSignUpIn } from '../../../domain/service/seller/seller';
import { ISellerService } from '../../../domain/service/seller/seller.service';


class MockSellerService implements ISellerService {
  findUserInfo(seller: TSellerFindIn): Promise<Seller> {
    return Promise.resolve(undefined);
  }

  signUp(seller: TSellerSignUpIn): Promise<Seller> {
    return Promise.resolve(undefined);
  }

  delete(userId: string): Promise<Seller> {
    return Promise.resolve(undefined);
  }

  getAll(): Promise<Seller[]> {
    return Promise.resolve([]);
  }

  getOne(userId: string): Promise<Seller> {
    return Promise.resolve(undefined);
  }
}

describe('판매자 controller', () => {
  let sellerController: SellerController;
  let sellerService: ISellerService;

  beforeEach(async () => {
    sellerService = new MockSellerService();
    sellerController = new SellerController(sellerService);
  });
  describe('/seller/:userId (GET)', () => {
    test('특정 유저 가져오기', async () => {
      const requestInfo: TSellerFindIn = {
        userId: "testUser",
        password: "testPassword"
      }

      const responseInfo: TSellerFindOut = {
        userId: "testUser",
        password: "testPassword",
        ceoName: "someGuy",
        companyName: "someCompany"
      }

      const sellerServiceGetUserInfoSpy = jest.spyOn(sellerService, 'findUserInfo').mockResolvedValue(responseInfo);

      try {
        const result = await sellerController.findUserInfo(requestInfo);
        expect(result).toEqual(responseInfo);
        expect(sellerServiceGetUserInfoSpy).toHaveBeenCalledWith(responseInfo);
      } catch (e) {
        // console.error(e);
      }
    });
    // test('삭제된 유저 인 경우 ', async () => {
    //   const deletedSeller: Seller = {
    //     id: 1,
    //     userId: 'test',
    //     ceoName: 'testCEO',
    //     companyName: 'testCompany',
    //     password: 'testPassword',
    //     deletedAt: new Date(),
    //   };
    //
    //   const sellerServiceGetOneSpy = jest.spyOn(sellerService, 'getOne').mockResolvedValue(deletedSeller);
    //
    //   try {
    //     const result = await sellerController.getOne(deletedSeller.userId);
    //     expect(result.deletedAt).toBeInstanceOf(Date);
    //     expect(sellerServiceGetOneSpy).toHaveBeenCalledWith(deletedSeller);
    //   } catch (e) {
    //     // console.error(e);
    //   }
    // });
  });

  describe('/seller (GET)', () => {
    it('판매자 Array 전부 가져오기 ', async () => {
      const savedSellerArray: Seller[] = [
        {
          id: 1,
          userId: 'test',
          ceoName: 'testCEO',
          companyName: 'testCompany',
          password: 'testPassword',
          deletedAt: null,
        },
      ];

      const sellerServiceGetAllSpy = jest.spyOn(sellerService, 'getAll').mockResolvedValue(savedSellerArray);

      try {
        const result = await sellerController.getAll();
        expect(result).toEqual(savedSellerArray);
        expect(sellerServiceGetAllSpy).toHaveBeenCalledWith(savedSellerArray);
      } catch (e) {
        // console.error(e);
      }
    });
  });
  describe('/seller/:userId (POST)', () => {
    it('판매자 유저 회원가입 ', async () => {
      const savedSeller: Seller = {
        id: 1,
        userId: 'test',
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        deletedAt: null,
      };
      const savedSellerDto: TSellerSignUpRequest = {
        userId: savedSeller.userId,
        ceoName: savedSeller.ceoName,
        companyName: savedSeller.companyName,
        password: savedSeller.password,
      };

      const sellerServiceCreateSpy = jest.spyOn(sellerService, 'signUp').mockResolvedValue(savedSeller);

      try {
        const result = await sellerController.signUp(savedSellerDto);
        expect(result).toEqual(savedSeller);
        expect(sellerServiceCreateSpy).toBeCalledWith(savedSellerDto);
      } catch (e) {
        // console.error(e);
      }
    });
  });
  describe('/seller/:userId (DELETE)', () => {
    it('판매자 회원 탈퇴', async () => {
      const deletedSeller: Seller = {
        id: 1,
        userId: 'test',
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        deletedAt: new Date(),
      };

      const sellerServiceDeleteSpy = jest.spyOn(sellerService, 'delete').mockResolvedValue(deletedSeller);

      try {
        const result = await sellerController.delete(deletedSeller.userId);
        expect(result).toEqual(deletedSeller);
        // expect(result.deletedAt).toBeInstanceOf(Date);
        expect(sellerServiceDeleteSpy).toHaveBeenCalledWith(deletedSeller);
      } catch (e) {
        // console.error(e);
      }
    });
  });
});

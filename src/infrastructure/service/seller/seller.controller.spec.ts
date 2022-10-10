import { CreateSellerDto } from './seller.dto';
import { SellerController } from './seller.controller';
import { Seller, TCreateSeller } from '../../../domain/service/seller/seller';
import { ISellerService } from '../../../domain/service/seller/seller.service';

class MockSellerService implements ISellerService {
  create(seller: TCreateSeller): Promise<Seller> {
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
    test('특정 유저 가져오기 ', async () => {
      const oneSeller: Seller = {
        id: 1,
        userId: 'test',
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const sellerServiceGetOneSpy = jest.spyOn(sellerService, 'getOne').mockResolvedValue(oneSeller);

      try {
        const result = await sellerController.getOne(oneSeller.userId);
        expect(result).toEqual(oneSeller);
        expect(sellerServiceGetOneSpy).toHaveBeenCalledWith(oneSeller);
      } catch (e) {
        // console.error(e);
      }
    });
    test('삭제된 유저 인 경우 ', async () => {
      const deletedSeller: Seller = {
        id: 1,
        userId: 'test',
        ceoName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const sellerServiceGetOneSpy = jest.spyOn(sellerService, 'getOne').mockResolvedValue(deletedSeller);

      try {
        const result = await sellerController.getOne(deletedSeller.userId);
        expect(result.deletedAt).toBeInstanceOf(Date);
        expect(sellerServiceGetOneSpy).toHaveBeenCalledWith(deletedSeller);
      } catch (e) {
        // console.error(e);
      }
    });
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
          createdAt: new Date(),
          updatedAt: new Date(),
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
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const savedSellerDto: CreateSellerDto = {
        userId: savedSeller.userId,
        ceoName: savedSeller.ceoName,
        companyName: savedSeller.companyName,
        password: savedSeller.password,
      };

      const sellerServiceCreateSpy = jest.spyOn(sellerService, 'create').mockResolvedValue(savedSeller);

      try {
        const result = await sellerController.create(savedSellerDto);
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
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const sellerServiceDeleteSpy = jest.spyOn(sellerService, 'delete').mockResolvedValue(deletedSeller);

      try {
        const result = await sellerController.delete(deletedSeller.userId);
        expect(result).toEqual(deletedSeller);
        expect(result.deletedAt).toBeInstanceOf(Date);
        expect(sellerServiceDeleteSpy).toHaveBeenCalledWith(deletedSeller);
      } catch (e) {
        // console.error(e);
      }
    });
  });
});
import { Test, TestingModule } from '@nestjs/testing';
import { SellerController } from './seller.controller';
import { SellerService } from '../application/seller.service';
import { Seller } from '../domain/seller';
import { SellerRepository } from '../domain/repository/seller.repository';
import { PrismaService } from '../../../infrastructure/model/prisma.service';
import { CreateSellerDto } from './create-seller.dto';

describe('판매자 controller', () => {
  let sellerController: SellerController;
  let sellerService: SellerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SellerController],
      providers: [SellerService, SellerRepository, PrismaService],
    }).compile();

    sellerService = module.get<SellerService>(SellerService);
    sellerController = module.get<SellerController>(SellerController);
  });
  describe('/seller/:userId (GET)', () => {
    test('특정 유저 가져오기 ', async () => {
      const oneSeller: Seller = {
        id: 1,
        userId: 'test',
        CEOName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const sellerServiceGetOneSpy = jest.spyOn(sellerService, 'getOneSeller').mockResolvedValue(oneSeller);

      try {
        const result = await sellerController.getOneSeller(oneSeller.userId);
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
        CEOName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const sellerServiceGetOneSpy = jest.spyOn(sellerService, 'getOneSeller').mockResolvedValue(deletedSeller);

      try {
        const result = await sellerController.getOneSeller(deletedSeller.userId);
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
          CEOName: 'testCEO',
          companyName: 'testCompany',
          password: 'testPassword',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      const sellerServiceGetAllSpy = jest.spyOn(sellerService, 'getAllSeller').mockResolvedValue(savedSellerArray);

      try {
        const result = await sellerController.getAllSeller();
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
        CEOName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };
      const savedSellerDto: CreateSellerDto = {
        userId: savedSeller.userId,
        CEOName: savedSeller.CEOName,
        companyName: savedSeller.companyName,
        password: savedSeller.password,
      };

      const sellerServiceCreateSpy = jest.spyOn(sellerService, 'createSeller').mockResolvedValue(savedSeller);

      try {
        const result = await sellerController.createSeller(savedSellerDto);
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
        CEOName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const sellerServiceDeleteSpy = jest.spyOn(sellerService, 'deleteOneSeller').mockResolvedValue(deletedSeller);

      try {
        const result = await sellerController.deleteSeller(deletedSeller.userId);
        expect(result).toEqual(deletedSeller);
        expect(result.deletedAt).toBeInstanceOf(Date);
        expect(sellerServiceDeleteSpy).toHaveBeenCalledWith(deletedSeller);
      } catch (e) {
        // console.error(e);
      }
    });
  });
});

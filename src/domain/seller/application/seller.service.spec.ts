import { Test, TestingModule } from '@nestjs/testing';
import { SellerService } from './seller.service';
import { SellerRepository } from '../domain/repository/seller.repository';
import { Seller } from '../domain/seller';
import { PrismaService } from '../../../infrastructure/model/prisma.service';

describe('seller service test ', () => {
  let sellerService: SellerService;
  let sellerRepository: SellerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SellerService, SellerRepository, PrismaService],
    }).compile();

    sellerService = module.get<SellerService>(SellerService);
    sellerRepository = module.get<SellerRepository>(SellerRepository);
  });

  describe('판매자 회원가입', () => {
    test('판매자 생성', async () => {
      // 유저 생성하기 Test 코드
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
      const createSeller = {
        userId: savedSeller.userId,
        CEOName: savedSeller.CEOName,
        companyName: savedSeller.companyName,
        password: savedSeller.password,
      };
      const sellerRepositorySaveSpy = jest.spyOn(sellerRepository, 'create').mockResolvedValue(savedSeller);
      try {
        const result = await sellerService.createSeller(createSeller);
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
          CEOName: 'testCEO',
          companyName: 'testCompany',
          password: 'testPassword',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
        {
          id: 2,
          userId: 'test2',
          CEOName: 'testCEO2',
          companyName: 'testCompany2',
          password: 'testPassword',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findAll').mockResolvedValue(savedSellerArray);
      try {
        const result = await sellerService.getAllSeller();
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
        CEOName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockResolvedValue(savedSeller);
      try {
        const result = await sellerService.getOneSeller(savedSeller.userId);
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
        CEOName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'findOne').mockRejectedValue(new Error('deleted seller'));
      try {
        const result = await sellerService.getOneSeller(savedSeller.userId);
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
        CEOName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'delete').mockRejectedValue(new Error('deleted seller'));

      try {
        await sellerService.deleteOneSeller(deletedSeller.userId);
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
        CEOName: 'testCEO',
        companyName: 'testCompany',
        password: 'testPassword',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      const sellerRepositoryFindOneSpy = jest.spyOn(sellerRepository, 'delete').mockResolvedValue(deletedSeller);

      try {
        const result = await sellerService.deleteOneSeller(deletedSeller.userId);

        expect(result).toEqual(deletedSeller);
        expect(sellerRepositoryFindOneSpy).toHaveBeenCalledWith(deletedSeller);
      } catch (e) {
        // console.error(e);
      }
    });
  });
});

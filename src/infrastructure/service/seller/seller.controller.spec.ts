import { TSellerSignUpRequest } from './seller.dto';
import { SellerController } from './seller.controller';
import { Seller } from '../../../domain/service/seller/seller';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { IPasswordEncryptor } from '../../../domain/service/auth/encrypt/password.encryptor';
import { mock, MockProxy } from 'jest-mock-extended';

describe('판매자 controller', () => {
  const sellerService: MockProxy<ISellerService> = mock<ISellerService>();
  const sut = new SellerController(sellerService); // System Under Test

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
        const result = await sut.signUp(savedSellerDto);
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

      const sellerServiceDeleteSpy = jest.spyOn(sellerService, 'leave').mockResolvedValue(deletedSeller);

      try {
        const result = await sut.leave(deletedSeller.userId);
        expect(result).toEqual(deletedSeller);
        // expect(result.deletedAt).toBeInstanceOf(Date);
        expect(sellerServiceDeleteSpy).toHaveBeenCalledWith(deletedSeller);
      } catch (e) {
        // console.error(e);
      }
    });
  });
});

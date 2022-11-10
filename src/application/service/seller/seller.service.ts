import { Inject, Injectable } from '@nestjs/common';
import { Seller, TCreateSeller, TSellerFindIn, TSellerFindOut } from '../../../domain/service/seller/seller';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { ISellerService } from '../../../domain/service/seller/seller.service';

@Injectable()
export class SellerService implements ISellerService {
  constructor(@Inject('ISellerRepository') private sellerRepository: ISellerRepository) {}

  async findUserInfo(sellerIn: TSellerFindIn): Promise<TSellerFindOut> {
    const sellerInfo: Seller = await this.sellerRepository.findUserInfo(sellerIn);

    // 추후에는 실제로 패스워드 인증하는 로직 (로그인 쪽) 맞춰서 하면 될듯 함
    if (sellerIn.password != sellerInfo.password) {
      throw Error("Password InCorrect")
    }

    if (sellerIn.password == sellerInfo.password) {
      return {
        userId: sellerInfo.userId,
        password: sellerInfo.password,
        ceoName: sellerInfo.ceoName,
        companyName: sellerInfo.companyName
      };
    }

    else {
      return null;
    }
  }

  async getOne(userId: string): Promise<Seller> {
    const oneSeller = await this.sellerRepository.findOne(userId);
    if (oneSeller.deletedAt) {
      console.error('deleted seller');
      return null;
    }
    return oneSeller;
  }

  async getAll(): Promise<Seller[]> {
    const allSeller = await this.sellerRepository.findAll();
    return allSeller;
  }

  async create(createSellerDto: TCreateSeller): Promise<Seller> {
    const oneSeller = await this.sellerRepository.create(createSellerDto);
    return oneSeller;
  }

  async delete(userId: string): Promise<Seller> {
    const oneSeller = await this.sellerRepository.findOne(userId);
    if (oneSeller.deletedAt) {
      console.error('이미 삭제된 유저');
      return null;
    }
    const deletedSeller = await this.sellerRepository.delete(userId);
    return deletedSeller;
  }
}

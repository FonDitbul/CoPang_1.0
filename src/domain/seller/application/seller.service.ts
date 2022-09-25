import { Injectable } from '@nestjs/common';
import { SellerRepository } from '../domain/repository/seller.repository';
import { Seller } from '../domain/seller';

type TCreateSeller = Pick<Seller, 'userId' | 'CEOName' | 'companyName' | 'password'>;

@Injectable()
export class SellerService {
  constructor(private sellerRepository: SellerRepository) {}
  // TODO find 할때 password 안가져오는 DTO 다루기
  async getOneSeller(userId: string): Promise<Seller> {
    const oneSeller = await this.sellerRepository.findOne(userId);
    try {
      if (oneSeller.deletedAt) {
        new Error('deleted seller');
      }
      return oneSeller;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async getAllSeller(): Promise<Seller[]> {
    const allSeller = await this.sellerRepository.findAll();
    return allSeller;
  }

  async createSeller(createSellerDto: TCreateSeller): Promise<Seller> {
    const oneSeller = await this.sellerRepository.create(createSellerDto);
    return oneSeller;
  }

  async deleteOneSeller(userId: string): Promise<Seller> {
    const oneSeller = await this.sellerRepository.findOne(userId);
    try {
      if (oneSeller.deletedAt) {
        new Error('deleted seller');
      }
      const deletedSeller = await this.sellerRepository.delete(userId);
      return deletedSeller;
    } catch (e) {
      console.error(e);
      throw e;
    }
  }
}

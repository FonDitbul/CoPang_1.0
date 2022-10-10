import { Inject, Injectable } from '@nestjs/common';
import { Seller, TCreateSeller } from '../../../domain/service/seller/seller';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { ISellerService } from '../../../domain/service/seller/seller.service';

@Injectable()
export class SellerService implements ISellerService {
  constructor(@Inject('ISellerRepository') private sellerRepository: ISellerRepository) {}

  async getOne(userId: string): Promise<Seller> {
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

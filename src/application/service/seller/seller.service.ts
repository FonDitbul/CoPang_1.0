import { Inject, Injectable } from '@nestjs/common';
import { Seller, TCreateSeller } from '../../../domain/service/seller/seller';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { ISellerService } from '../../../domain/service/seller/seller.service';

@Injectable()
export class SellerService implements ISellerService {
  constructor(@Inject('ISellerRepository') private sellerRepository: ISellerRepository) {}

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

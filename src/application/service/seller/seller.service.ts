import { Inject, Injectable } from '@nestjs/common';
import { ISellerSignInIn, Seller, TCreateSeller } from '../../../domain/service/seller/seller';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { IPasswordEncryptor } from '../../../domain/service/auth/encrypt/password.encryptor';

@Injectable()
export class SellerService implements ISellerService {
  constructor(@Inject('ISellerRepository') private sellerRepository: ISellerRepository, @Inject('IPasswordEncryptor') private passwordEncryptor: IPasswordEncryptor) {}

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

  async signIn(seller: ISellerSignInIn) {
    const oneSeller = await this.sellerRepository.findOne(seller.userId);
    if (!oneSeller || oneSeller.deletedAt) {
      return null;
    }

    const comparePassword = await this.passwordEncryptor.compare(seller.password, oneSeller.password);
    if (!comparePassword) {
      return null;
    }

    return oneSeller;
  }

  async signOut(userId: string) {
    const oneSeller = await this.sellerRepository.findOne(userId);
    if (!oneSeller || oneSeller.deletedAt) {
      return null;
    }

    return true;
  }
}

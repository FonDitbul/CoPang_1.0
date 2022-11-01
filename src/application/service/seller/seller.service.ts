import { Inject, Injectable } from '@nestjs/common';
import { Seller, SellerSignUpInbound, SellerSignUpOutbound } from '../../../domain/service/seller/seller';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { IPasswordEncryptor } from "../../../domain/service/auth/encrypt/password.encryptor";

@Injectable()
export class SellerService implements ISellerService {
  constructor(
      @Inject('ISellerRepository') private sellerRepository: ISellerRepository,
      @Inject('IPasswordEncryptor') private passwordEncryptor: IPasswordEncryptor,
  ) {}

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

  async signUp(sellerSignUpInbound: SellerSignUpInbound): Promise<Seller> {
    const sellerWithSameUserId = await this.sellerRepository.findOne(sellerSignUpInbound.userId);
    if (sellerWithSameUserId !== null) {
      throw Error("이미 등록된 판매자 아이디")
    }

    const sellerSignUpOutbound: SellerSignUpOutbound = {
      ...sellerSignUpInbound,
      password: await this.passwordEncryptor.encrypt(sellerSignUpInbound.password),
    }
    return await this.sellerRepository.create(sellerSignUpOutbound);
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

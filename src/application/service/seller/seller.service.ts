import { Inject, Injectable } from '@nestjs/common';
import { ISellerSignInIn, Seller, TSellerSignUpIn, TSellerSignUpOut } from '../../../domain/service/seller/seller';
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

  async signUp(sellerSignUpIn: TSellerSignUpIn): Promise<Seller> {
    const sellerWithSameUserId = await this.sellerRepository.findOne(sellerSignUpIn.userId);
    if (sellerWithSameUserId !== null) {
      throw Error("이미 등록된 판매자 아이디")
    }

    const sellerSignUpOut: TSellerSignUpOut = {
      ...sellerSignUpIn,
      password: await this.passwordEncryptor.encrypt(sellerSignUpIn.password),
    }
    return await this.sellerRepository.signUp(sellerSignUpOut);
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
    // 1. user Id를 통해 seller 정보 가져오기
    const oneSeller = await this.sellerRepository.findOne(seller.userId);
    if (!oneSeller || oneSeller.deletedAt) {
      return null;
    }

    // 2. password 가 일치하는지 판단
    const comparePassword = await this.authService.signIn(seller.password, oneSeller.password);
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

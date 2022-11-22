import { Inject, Injectable } from '@nestjs/common';
import {
  ISellerChangeInfoIn,
  ISellerSignInIn,
  Seller,
  TSellerChangeInfoOut,
  TSellerSignUpIn,
  TSellerSignUpOut
} from "../../../domain/service/seller/seller";
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { IPasswordEncryptor } from '../../../domain/service/auth/encrypt/password.encryptor';

@Injectable()
export class SellerService implements ISellerService {
  constructor(@Inject('ISellerRepository') private sellerRepository: ISellerRepository, @Inject('IPasswordEncryptor') private passwordEncryptor: IPasswordEncryptor) {}

  async signUp(sellerSignUpIn: TSellerSignUpIn): Promise<Seller> {
    const sellerWithSameUserId = await this.sellerRepository.findOne(sellerSignUpIn.userId);
    if (sellerWithSameUserId !== null) {
      throw Error('이미 등록된 판매자 아이디');
    }

    const sellerSignUpOut: TSellerSignUpOut = {
      ...sellerSignUpIn,
      password: await this.passwordEncryptor.encrypt(sellerSignUpIn.password),
    };
    return await this.sellerRepository.signUp(sellerSignUpOut);
  }

  async leave(userId: string): Promise<Seller> {
    const seller = await this.sellerRepository.findOne(userId);
    if (seller === null) {
      throw Error('판매자 아이디에 해당하는 판매자 정보 존재하지 않음');
    }
    if (seller.deletedAt) {
      throw Error('이미 삭제된 판매자');
    }
    return await this.sellerRepository.delete(userId);
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

  async findUser(userId: string): Promise<Seller> {
    const seller = await this.sellerRepository.findOne(userId);
    if (!seller || seller.deletedAt) {
      return null;
    }
    return seller;
  }

  async changeInfo(sellerChangeInfoIn: ISellerChangeInfoIn): Promise<Seller> {
    const seller = await this.sellerRepository.findOne(sellerChangeInfoIn.originUserId);
    const changeSeller = await this.sellerRepository.findOne(sellerChangeInfoIn.userId);

    if (!seller || seller.deletedAt) {
      return null;
    }

    if (changeSeller && changeSeller.deletedAt === null) {
      throw Error('이미 존재하는 유저 아이디 입니다.');
    }

    const comparePassword = await this.passwordEncryptor.compare(sellerChangeInfoIn.originPassword, seller.password);
    if (!comparePassword) {
      return null;
    }

    const sellerChangeInfoOut: TSellerChangeInfoOut = {
      ...sellerChangeInfoIn,
      id: seller.id,
      password: await this.passwordEncryptor.encrypt(sellerChangeInfoIn.password),
    }

    return await this.sellerRepository.update(sellerChangeInfoOut);
  }
}


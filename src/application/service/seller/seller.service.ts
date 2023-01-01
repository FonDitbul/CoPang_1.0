import { Inject, Injectable } from '@nestjs/common';
import {
  ISellerChangeInfoIn,
  ISellerSignInIn,
  Seller,
  TSellerChangeInfoOut,
  TSellerSignUpIn,
  TSellerSignUpOut,
} from '../../../domain/service/seller/seller';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { IPasswordEncryptor } from '../../../domain/service/auth/encrypt/password.encryptor';
import { CoPangException, EXCEPTION_STATUS } from '../../../domain/common/exception';

@Injectable()
export class SellerService implements ISellerService {
  constructor(
    @Inject('ISellerRepository') private sellerRepository: ISellerRepository,
    @Inject('IPasswordEncryptor') private passwordEncryptor: IPasswordEncryptor,
  ) {}

  async signUp(sellerSignUpIn: TSellerSignUpIn): Promise<Seller> {
    const sellerWithSameUserId = await this.sellerRepository.findOne(sellerSignUpIn.userId);
    if (sellerWithSameUserId !== null) {
      throw new CoPangException(EXCEPTION_STATUS.USER_ID_DUPLICATE);
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
      throw new CoPangException(EXCEPTION_STATUS.USER_NOT_EXIST);
    }
    if (seller.deletedAt) {
      throw new CoPangException(EXCEPTION_STATUS.USER_DELETED);
    }
    return await this.sellerRepository.delete(userId);
  }

  async signIn(seller: ISellerSignInIn) {
    const oneSeller = await this.sellerRepository.findOne(seller.userId);
    if (!oneSeller) {
      throw new CoPangException(EXCEPTION_STATUS.USER_NOT_EXIST);
    }

    if (oneSeller.deletedAt) {
      throw new CoPangException(EXCEPTION_STATUS.USER_DELETED);
    }

    const isPasswordRight = await this.passwordEncryptor.compare(seller.password, oneSeller.password);
    if (!isPasswordRight) {
      throw new CoPangException(EXCEPTION_STATUS.USER_PASSWORD_NOT_MATCH);
    }

    return oneSeller;
  }

  async signOut(userId: string) {
    const oneSeller = await this.sellerRepository.findOne(userId);
    if (!oneSeller) {
      throw new CoPangException(EXCEPTION_STATUS.USER_NOT_EXIST);
    }

    if (oneSeller.deletedAt) {
      throw new CoPangException(EXCEPTION_STATUS.USER_DELETED);
    }

    return true;
  }

  async findUser(userId: string): Promise<Seller> {
    const seller = await this.sellerRepository.findOne(userId);
    if (!seller) {
      throw new CoPangException(EXCEPTION_STATUS.USER_NOT_EXIST);
    }

    if (seller.deletedAt) {
      throw new CoPangException(EXCEPTION_STATUS.USER_DELETED);
    }

    return seller;
  }

  async changeInfo(sellerChangeInfoIn: ISellerChangeInfoIn): Promise<Seller> {
    const seller = await this.sellerRepository.findOne(sellerChangeInfoIn.originUserId);

    if (!seller) {
      throw new CoPangException(EXCEPTION_STATUS.USER_NOT_EXIST);
    }

    if (seller.deletedAt) {
      throw new CoPangException(EXCEPTION_STATUS.USER_DELETED);
    }

    const isPasswordRight = await this.passwordEncryptor.compare(sellerChangeInfoIn.originPassword, seller.password);
    if (!isPasswordRight) {
      throw new CoPangException(EXCEPTION_STATUS.USER_PASSWORD_NOT_MATCH);
    }

    const sellerChangeInfoOut: TSellerChangeInfoOut = {
      ...sellerChangeInfoIn,
      userId: seller.userId,
      id: seller.id,
      password: await this.passwordEncryptor.encrypt(sellerChangeInfoIn.password),
    };

    return await this.sellerRepository.update(sellerChangeInfoOut);
  }
}

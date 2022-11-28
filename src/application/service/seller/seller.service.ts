import { Inject, Injectable } from '@nestjs/common';
import { ISellerChangeInfoIn, ISellerSignInIn, Seller, TSellerChangeInfoOut, TSellerSignUpIn, TSellerSignUpOut } from '../../../domain/service/seller/seller';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { IPasswordEncryptor } from '../../../domain/service/auth/encrypt/password.encryptor';
import { ERROR_STATUS } from '../../../domain/common/const';

@Injectable()
export class SellerService implements ISellerService {
  constructor(@Inject('ISellerRepository') private sellerRepository: ISellerRepository, @Inject('IPasswordEncryptor') private passwordEncryptor: IPasswordEncryptor) {}

  async signUp(sellerSignUpIn: TSellerSignUpIn): Promise<Seller> {
    const sellerWithSameUserId = await this.sellerRepository.findOne(sellerSignUpIn.userId);
    if (sellerWithSameUserId !== null) {
      throw new Error(ERROR_STATUS.userIdDuplicate);
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
      throw new Error(ERROR_STATUS.userNotExist);
    }
    if (seller.deletedAt) {
      throw new Error(ERROR_STATUS.userDelete);
    }
    return await this.sellerRepository.delete(userId);
  }

  async signIn(seller: ISellerSignInIn) {
    const oneSeller = await this.sellerRepository.findOne(seller.userId);
    if (!oneSeller) {
      throw new Error(ERROR_STATUS.userNotExist);
    }

    if (oneSeller.deletedAt) {
      throw new Error(ERROR_STATUS.userDelete);
    }

    const isPasswordRight = await this.passwordEncryptor.compare(seller.password, oneSeller.password);
    if (!isPasswordRight) {
      throw new Error(ERROR_STATUS.userPasswordNotMatch);
    }

    return oneSeller;
  }

  async signOut(userId: string) {
    const oneSeller = await this.sellerRepository.findOne(userId);
    if (!oneSeller) {
      throw new Error(ERROR_STATUS.userNotExist);
    }

    if (oneSeller.deletedAt) {
      throw new Error(ERROR_STATUS.userDelete);
    }

    return true;
  }

  async findUser(userId: string): Promise<Seller> {
    const seller = await this.sellerRepository.findOne(userId);
    if (!seller) {
      throw new Error(ERROR_STATUS.userNotExist);
    }

    if (seller.deletedAt) {
      throw new Error(ERROR_STATUS.userDelete);
    }

    return seller;
  }

  async changeInfo(sellerChangeInfoIn: ISellerChangeInfoIn): Promise<Seller> {
    const seller = await this.sellerRepository.findOne(sellerChangeInfoIn.originUserId);

    if (!seller) {
      throw new Error(ERROR_STATUS.userNotExist);
    }

    if (seller.deletedAt) {
      throw new Error(ERROR_STATUS.userDelete);
    }

    const isPasswordRight = await this.passwordEncryptor.compare(sellerChangeInfoIn.originPassword, seller.password);
    if (!isPasswordRight) {
      throw new Error(ERROR_STATUS.userPasswordNotMatch);
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

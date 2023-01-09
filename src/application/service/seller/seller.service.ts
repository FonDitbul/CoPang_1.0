import { Inject, Injectable } from '@nestjs/common';
import {
  ISellerChangeInfoIn,
  ISellerFindProductPaging,
  ISellerSignInIn,
  Seller,
  TSellerChangeInfoOut,
  TSellerFindProductIn,
  TSellerFindProductOut,
  TSellerSearchProductIn,
  TSellerSearchProductOut,
  TSellerSignUpIn,
  TSellerSignUpOut,
} from '../../../domain/service/seller/seller';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { IProductRepository } from '../../../domain/service/product/product.repository';
import { ISellerService } from '../../../domain/service/seller/seller.service';
import { IPasswordEncryptor } from '../../../domain/service/auth/encrypt/password.encryptor';
import { CoPangException, EXCEPTION_STATUS } from '../../../domain/common/exception';

@Injectable()
export class SellerService implements ISellerService {
  constructor(
    @Inject('ISellerRepository') private sellerRepository: ISellerRepository,
    @Inject('IProductRepository') private productRepository: IProductRepository,
    @Inject('IPasswordEncryptor') private passwordEncryptor: IPasswordEncryptor,
  ) {}

  private readonly MAX_NUMBER: number = 20;
  private readonly SORT_BY: string[] = ['id', 'price', 'createdAt'];
  private readonly ORDER: string[] = ['asc', 'desc'];

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

  async findProduct(condition: TSellerFindProductIn): Promise<ISellerFindProductPaging> {
    const sellerId = condition.sellerId;
    const sortBy = condition.sortBy;
    const order = condition.order;
    const pageNum = condition.pageNum - 1;

    if (!this.SORT_BY.includes(sortBy)) {
      throw new CoPangException(EXCEPTION_STATUS.PAGING_SORT_BY_OPTION_ERROR);
    }

    if (!this.ORDER.includes(order)) {
      throw new CoPangException(EXCEPTION_STATUS.PAGING_ORDER_OPTION_ERROR);
    }

    if (pageNum < 0) {
      throw new CoPangException(EXCEPTION_STATUS.PAGING_NUM_ERROR);
    }

    const repositoryCondition: TSellerFindProductOut = {
      sellerId: sellerId,
      sortBy: sortBy,
      order: order,
      skip: pageNum * this.MAX_NUMBER,
      take: this.MAX_NUMBER,
    };
    const [count, allProduct] = await this.productRepository.findAllWithSellerAndCount(repositoryCondition);

    const totalPageNum = Math.round(count / this.MAX_NUMBER) + 1;
    const currentPageNum = pageNum + 1;

    if (currentPageNum > totalPageNum) {
      throw new CoPangException(EXCEPTION_STATUS.PAGING_NUM_ERROR);
    }

    return {
      products: allProduct,
      currentPageNum: currentPageNum,
      totalPageNum: totalPageNum,
    };
  }

  async searchProduct(condition: TSellerSearchProductIn): Promise<ISellerFindProductPaging> {
    const sellerId = condition.sellerId;
    const text = condition.text;
    const sortBy = condition.sortBy;
    const order = condition.order;
    const pageNum = condition.pageNum - 1;

    if (!this.SORT_BY.includes(sortBy)) {
      throw new CoPangException(EXCEPTION_STATUS.PAGING_SORT_BY_OPTION_ERROR);
    }

    if (!this.ORDER.includes(order)) {
      throw new CoPangException(EXCEPTION_STATUS.PAGING_ORDER_OPTION_ERROR);
    }

    if (!text) {
      throw new CoPangException(EXCEPTION_STATUS.SEARCH_STRING_EMPTY);
    }

    if (pageNum < 0) {
      throw new CoPangException(EXCEPTION_STATUS.PAGING_NUM_ERROR);
    }

    const repositoryCondition: TSellerSearchProductOut = {
      sellerId: sellerId,
      text: text,
      sortBy: sortBy,
      order: order,
      skip: pageNum * this.MAX_NUMBER,
      take: this.MAX_NUMBER,
    };
    const [count, allProduct] = await this.productRepository.findSearchWithSellerAndCount(repositoryCondition);

    const totalPageNum = Math.round(count / this.MAX_NUMBER) + 1;
    const currentPageNum = pageNum + 1;

    if (currentPageNum > totalPageNum) {
      throw new CoPangException(EXCEPTION_STATUS.PAGING_NUM_ERROR);
    }

    return {
      products: allProduct,
      currentPageNum: currentPageNum,
      totalPageNum: totalPageNum,
    };
  }
}

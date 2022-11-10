import { Injectable } from '@nestjs/common';
import { Seller as SellerEntity } from '@prisma/client';
import { Seller, TSellerFindIn, TSellerSignUpOut } from '../../../domain/service/seller/seller';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SellerPrismaRepository implements ISellerRepository {
  constructor(private prisma: PrismaService) {}

  async findUserInfo(seller: TSellerFindIn): Promise<Seller> {

    try {
      // 내부 패스워드 검증 로직 Init, 로그인에 사용되는 로직과 같은 로직을 사용하면 될 듯 합니다.
      return await this.prisma.seller.findUnique({
        where: {
          userId: seller.userId,
        },
      });
    } catch (e) {
      throw new Error("Password InCorrect")
    }
  }

  async findOne(userId: string): Promise<SellerEntity | null> {
    return await this.prisma.seller.findUnique({
      where: {
        userId: userId,
      },
    });
  }

  async findAll(): Promise<SellerEntity[]> {
    return await this.prisma.seller.findMany({});
  }

  async signUp(sellerSignUpOut: TSellerSignUpOut): Promise<SellerEntity> {
    return await this.prisma.seller.create({
      data: {
        userId: sellerSignUpOut.userId,
        ceoName: sellerSignUpOut.ceoName,
        companyName: sellerSignUpOut.companyName,
        password: sellerSignUpOut.password,
      },
    });
  }

  async delete(userId: string): Promise<SellerEntity> {
    return await this.prisma.seller.update({
      where: {
        userId: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}

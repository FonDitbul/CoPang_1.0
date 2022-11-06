import { Injectable } from '@nestjs/common';
import { Seller as SellerEntity } from '@prisma/client';
import { SellerSignUpOut } from '../../../domain/service/seller/seller';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SellerPrismaRepository implements ISellerRepository {
  constructor(private prisma: PrismaService) {}

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

  async signUp(sellerSignUpOutbound: SellerSignUpOut): Promise<SellerEntity> {
    return await this.prisma.seller.create({
      data: {
        userId: sellerSignUpOutbound.userId,
        ceoName: sellerSignUpOutbound.ceoName,
        companyName: sellerSignUpOutbound.companyName,
        password: sellerSignUpOutbound.password,
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

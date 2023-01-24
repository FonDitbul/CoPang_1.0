import { Injectable } from '@nestjs/common';
import { Seller as SellerEntity } from '@prisma/client';
import { TSellerChangeInfoOut, TSellerSignUpOut } from '../../../domain/service/seller/seller';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SellerPrismaRepository implements ISellerRepository {
  constructor(private prisma: PrismaService) {}

  async findOneById(id: number): Promise<SellerEntity | null> {
    return await this.prisma.seller.findUnique({
      where: {
        id: id,
      },
    });
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

  async update(changeSeller: TSellerChangeInfoOut): Promise<SellerEntity> {
    return await this.prisma.seller.update({
      where: {
        id: changeSeller.id,
      },
      data: {
        userId: changeSeller.userId,
        ceoName: changeSeller.ceoName,
        companyName: changeSeller.companyName,
        password: changeSeller.password,
        updatedAt: new Date(),
      },
    });
  }
}

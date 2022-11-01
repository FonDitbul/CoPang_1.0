import { Injectable } from '@nestjs/common';
import { Seller as SellerEntity } from '@prisma/client';
import { TCreateSeller } from '../../../domain/service/seller/seller';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SellerPrismaRepository implements ISellerRepository {
  constructor(private prisma: PrismaService) {}

  // TODO 여기서 데이터가 없다고 500 에러 뱉는건 말이 안됨 테스트 및 체크 필요
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

  async create(seller: TCreateSeller): Promise<SellerEntity> {
    return await this.prisma.seller.create({
      data: {
        userId: seller.userId,
        ceoName: seller.ceoName,
        companyName: seller.companyName,
        password: seller.password,
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

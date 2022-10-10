import { Injectable } from '@nestjs/common';
import { Seller } from '../../../domain/service/seller/seller';
import { CreateSellerDto } from './seller.dto';
import { ISellerRepository } from '../../../domain/service/seller/seller.repository';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SellerRepository implements ISellerRepository {
  constructor(private prisma: PrismaService) {}

  async findOne(userId: string): Promise<Seller | null> {
    return await this.prisma.seller.findUnique({
      where: {
        userId: userId,
      },
    });
  }

  async findAll(): Promise<Seller[]> {
    return await this.prisma.seller.findMany({});
  }

  async create(seller: CreateSellerDto): Promise<Seller> {
    return await this.prisma.seller.create({
      data: {
        userId: seller.userId,
        ceoName: seller.ceoName,
        companyName: seller.companyName,
        password: seller.password,
      },
    });
  }

  async delete(userId: string): Promise<Seller> {
    return await this.prisma.seller.delete({
      where: {
        userId: userId,
      },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { Seller } from '@prisma/client';
import { PrismaService } from '../../../../infrastructure/model/prisma.service';
import { CreateSellerDto } from '../../interface/create-seller.dto';
import { ISellerRepository } from '../../infrastructure/seller.repository';

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
        CEOName: seller.CEOName,
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

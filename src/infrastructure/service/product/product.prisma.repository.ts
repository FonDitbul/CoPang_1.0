import { Injectable } from '@nestjs/common';
import { Product as ProductEntity } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { IProductRepository } from '../../../domain/service/product/product.repository';

@Injectable()
export class ProductPrismaRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ProductEntity[]> {
    return await this.prisma.product.findMany({});
  }
}

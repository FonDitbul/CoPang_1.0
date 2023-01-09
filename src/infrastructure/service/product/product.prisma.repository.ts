import { Injectable } from '@nestjs/common';
import { Product as ProductEntity, SellerProduct as SellerProductEntity } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { IProductRepository } from '../../../domain/service/product/product.repository';
import { TSellerFindProductOut, TSellerSearchProductOut } from '../../../domain/service/seller/seller';

@Injectable()
export class ProductPrismaRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ProductEntity[]> {
    return await this.prisma.product.findMany({});
  }
  async findAllWithSellerAndCount(condition: TSellerFindProductOut): Promise<[number, SellerProductEntity[]]> {
    const sellerId = condition.sellerId;
    const orderCondition: { [key: string]: string } = {};
    orderCondition[condition.sortBy] = condition.order;

    const sellerProductCount = await this.prisma.sellerProduct.count({
      where: {
        sellerId: sellerId,
        deletedAt: null,
      },
    });

    const sellerProduct = await this.prisma.sellerProduct.findMany({
      where: {
        sellerId: condition.sellerId,
        deletedAt: null,
      },
      orderBy: [orderCondition],
      include: {
        Products: true,
      },
      skip: condition.skip,
      take: condition.take,
    });
    return [sellerProductCount, sellerProduct];
  }

  async findSearchWithSellerAndCount(condition: TSellerSearchProductOut): Promise<[number, SellerProductEntity[]]> {
    const sellerId = condition.sellerId;
    const text = condition.text;
    const orderCondition: { [key: string]: string } = {};
    orderCondition[condition.sortBy] = condition.order;

    const sellerProductCount = await this.prisma.sellerProduct.count({
      where: {
        sellerId: sellerId,
        Products: {
          productName: {
            contains: text,
          },
        },
        deletedAt: null,
      },
    });

    const sellerProduct = await this.prisma.sellerProduct.findMany({
      where: {
        sellerId: condition.sellerId,
        Products: {
          productName: {
            contains: text,
          },
        },
        deletedAt: null,
      },
      orderBy: [orderCondition],
      include: {
        Products: true,
      },
      skip: condition.skip,
      take: condition.take,
    });
    return [sellerProductCount, sellerProduct];
  }
}

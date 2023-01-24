import { Injectable } from '@nestjs/common';
import { Prisma, SellerProduct as SellerProductEntity } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { IProductRepository } from '../../../domain/service/product/product.repository';
import { TSellerFindProductOut } from '../../../domain/service/seller/seller';

@Injectable()
export class ProductPrismaRepository implements IProductRepository {
  constructor(private prisma: PrismaService) {}

  async findAllWithSellerCount(condition: TSellerFindProductOut): Promise<number> {
    const sellerId = condition.sellerId;
    const text = condition.text;

    let whereCondition: Prisma.SellerProductWhereInput = {
      sellerId: sellerId,
      deletedAt: null,
    };

    if (text) {
      whereCondition = {
        sellerId: sellerId,
        deletedAt: null,
        Products: {
          productName: {
            contains: text,
          },
        },
      };
    }

    const sellerProductCount = await this.prisma.sellerProduct.count({
      where: whereCondition,
    });

    return sellerProductCount;
  }

  async findAllWithSeller(condition: TSellerFindProductOut): Promise<SellerProductEntity[]> {
    const sellerId = condition.sellerId;
    const text = condition.text;
    const orderCondition: { [key: string]: string } = {};
    orderCondition[condition.sortBy] = condition.order;

    let whereCondition: Prisma.SellerProductWhereInput = {
      sellerId: sellerId,
      deletedAt: null,
    };

    if (text) {
      whereCondition = {
        sellerId: sellerId,
        deletedAt: null,
        Products: {
          productName: {
            contains: text,
          },
        },
      };
    }

    const sellerProduct = await this.prisma.sellerProduct.findMany({
      where: whereCondition,
      orderBy: [orderCondition],
      include: {
        Products: true,
      },
      skip: condition.skip,
      take: condition.take,
    });

    return sellerProduct;
  }
}

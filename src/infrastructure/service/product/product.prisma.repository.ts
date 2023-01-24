import { Injectable } from '@nestjs/common';
import { Prisma, SellerProduct as SellerProductEntity } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { IProductRepository } from '../../../domain/service/product/product.repository';
import { SellerProduct, TSellerFindProductOut } from '../../../domain/service/seller/seller';
import { IAddProductOut, IAddSellerProductOut, Product } from '../../../domain/service/product/product';

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

  async addOne(addProductOut: IAddProductOut): Promise<Product> {
    return await this.prisma.product.create({
      data: {
        productName: addProductOut.productName,
        productDesc: addProductOut.productDesc,
      },
    });
  }

  async addOneSellerProduct(addSellerProductOut: IAddSellerProductOut): Promise<SellerProduct> {
    return await this.prisma.sellerProduct.create({
      data: {
        sellerId: addSellerProductOut.sellerId,
        productId: addSellerProductOut.productId,
        price: addSellerProductOut.price,
        count: addSellerProductOut.price,
      },
    });
  }

  async removeProductEntity(productId: number): Promise<void> {
    await this.prisma.product.delete({
      where: {
        id: productId,
      }
    });
  }

  async removeSellerProductEntity(sellerProductId: number): Promise<void> {
    await this.prisma.sellerProduct.delete({
      where: {
        id: sellerProductId,
      }
    });
  }
}

import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductPrismaRepository } from './product.prisma.repository';
import { ProductService } from '../../../application/service/product/product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [],
  controllers: [ProductController],
  providers: [
    {
      provide: 'IProductRepository',
      useClass: ProductPrismaRepository,
    },
    {
      provide: 'IProductService',
      useClass: ProductService,
    },
    PrismaService,
  ],
})
export class ProductModule {}

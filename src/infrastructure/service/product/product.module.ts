import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProductPrismaRepository } from './product.prisma.repository';

@Module({
  imports: [],
  controllers: [],
  providers: [
    {
      provide: 'IProductRepository',
      useClass: ProductPrismaRepository,
    },
    PrismaService,
  ],
})
export class ProductModule {}

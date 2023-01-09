import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SellerService } from '../../../application/service/seller/seller.service';
import { SellerController } from './seller.controller';
import { SellerPrismaRepository } from './seller.prisma.repository';
import { AuthModule } from '../auth/auth.module';
import { ProductPrismaRepository } from '../product/product.prisma.repository';

@Module({
  imports: [AuthModule],
  controllers: [SellerController],
  providers: [
    {
      provide: 'ISellerRepository',
      useClass: SellerPrismaRepository,
    },
    {
      provide: 'IProductRepository',
      useClass: ProductPrismaRepository,
    },
    {
      provide: 'ISellerService',
      useClass: SellerService,
    },
    PrismaService,
  ],
})
export class SellerModule {}

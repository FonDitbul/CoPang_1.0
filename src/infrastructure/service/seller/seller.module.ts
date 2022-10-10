import { Module } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SellerService } from '../../../application/service/seller/seller.service';
import { SellerController } from './seller.controller';
import { SellerRepository } from './seller.repository';

@Module({
  imports: [],
  controllers: [SellerController],
  providers: [
    {
      provide: 'ISellerRepository',
      useClass: SellerRepository,
    },
    {
      provide: 'ISellerService',
      useClass: SellerService,
    },
    PrismaService,
  ],
})
export class SellerModule {}

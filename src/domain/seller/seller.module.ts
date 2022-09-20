import { Module } from '@nestjs/common';
import { SellerService } from './application/seller.service';
import { SellerController } from './interface/seller.controller';
import { PrismaService } from '../../infrastructure/model/prisma.service';
import { SellerRepository } from './domain/repository/seller.repository';

@Module({
  imports: [],
  controllers: [SellerController],
  providers: [SellerService, SellerRepository, PrismaService],
})
export class SellerModule {}

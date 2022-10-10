import { Module } from '@nestjs/common';
import { SellerModule } from './service/seller/seller.module';

@Module({
  imports: [SellerModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

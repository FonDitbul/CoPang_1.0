import { Module } from '@nestjs/common';
import { SellerModule } from './service/seller/seller.module';
import { AuthModule } from './service/auth/auth.module';
import { ProductModule } from './service/product/product.module';

@Module({
  imports: [SellerModule, ProductModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

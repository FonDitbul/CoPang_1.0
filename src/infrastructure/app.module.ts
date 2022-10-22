import { Module } from '@nestjs/common';
import { SellerModule } from './service/seller/seller.module';
import { AuthModule } from './service/auth/auth.module';

@Module({
  imports: [SellerModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

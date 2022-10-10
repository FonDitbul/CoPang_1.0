import { Body, Controller, Delete, Get, Inject, Param, Post } from '@nestjs/common';
import { CreateSellerDto } from './seller.dto';
import { Seller } from '../../../domain/service/seller/seller';
import { ISellerService } from '../../../domain/service/seller/seller.service';

@Controller()
export class SellerController {
  constructor(@Inject('ISellerService') private sellerService: ISellerService) {}

  @Get('/seller')
  async getAll(): Promise<Seller[]> {
    return await this.sellerService.getAll();
  }

  @Get('/seller/:userId')
  async getOne(@Param('userId') userId: string): Promise<Seller> {
    return await this.sellerService.getOne(userId);
  }

  @Post('/seller')
  async create(@Body() createSellerDto: CreateSellerDto): Promise<Seller> {
    return await this.sellerService.create(createSellerDto);
  }

  @Delete('/seller/:userId')
  async delete(@Param('userId') userId: string): Promise<Seller> {
    return await this.sellerService.delete(userId);
  }
}

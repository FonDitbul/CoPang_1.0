import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SellerService } from '../application/seller.service';
import { CreateSellerDto } from './create-seller.dto';
import { Seller } from '../domain/seller';

@Controller('/seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}

  @Get()
  async getAllSeller(): Promise<Seller[]> {
    return await this.sellerService.getAllSeller();
  }

  @Get(':userId')
  async getOneSeller(@Param('userId') userId: string): Promise<Seller> {
    return await this.sellerService.getOneSeller(userId);
  }

  @Post()
  async createSeller(@Body() createSellerDto: CreateSellerDto): Promise<Seller> {
    return await this.sellerService.createSeller(createSellerDto);
  }

  @Delete(':userId')
  async deleteSeller(@Param('userId') userId: string): Promise<Seller> {
    return await this.sellerService.deleteOneSeller(userId);
  }
}

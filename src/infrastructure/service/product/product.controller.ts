import { Controller, Get, Inject } from '@nestjs/common';
import { IProductService } from '../../../domain/service/product/product.service';

@Controller()
export class ProductController {
  constructor(@Inject('IProductService') private productService: IProductService) {}

  @Get('/product')
  async findAll() {
    const allProduct = await this.productService.findAll();

    return allProduct;
  }
}

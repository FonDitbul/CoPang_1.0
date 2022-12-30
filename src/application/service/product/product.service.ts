import { Inject, Injectable } from '@nestjs/common';
import { IProductService } from '../../../domain/service/product/product.service';
import { IProductRepository } from '../../../domain/service/product/product.repository';
import { Product } from '../../../domain/service/product/product';

@Injectable()
export class ProductService implements IProductService {
  constructor(@Inject('IProductRepository') private productRepository: IProductRepository) {}

  async findAll(): Promise<Product[]> {
    const allProduct = await this.productRepository.findAll();
    return allProduct;
  }
}

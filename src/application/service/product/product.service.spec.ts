import { IProductService } from '../../../domain/service/product/product.service';
import { ProductService } from './product.service';
import { mock, MockProxy, any } from 'jest-mock-extended';
import { IProductRepository } from '../../../domain/service/product/product.repository';

describe('Product service test ', () => {
  const productRepository: MockProxy<IProductRepository> = mock<IProductRepository>();
  const sut: IProductService = new ProductService(productRepository); // System Under Test;

  describe('product temp test ', () => {
    test('test', async () => {
      const productList = [];
      productRepository.findAll.calledWith().mockResolvedValue(productList);

      const actualProduct = await sut.findAll();

      expect(actualProduct).toEqual(productList);
    });
  });
});

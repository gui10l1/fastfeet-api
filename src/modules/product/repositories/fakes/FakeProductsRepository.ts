import { v4 } from 'uuid';

import IProductsRepositoryDTO from '@modules/product/dtos/IProductsRepositoryDTO';
import Product from '@modules/product/infra/database/typeorm/entities/Product';

import IProductsRepository from '../IProductsRepository';

export default class FakeProductsRepository implements IProductsRepository {
  private products: Product[] = [];

  public async create(data: IProductsRepositoryDTO): Promise<Product> {
    const product = new Product();

    Object.assign(product, {
      id: v4(),
      product_in_stock: data.quantityInStock,
      ...data,
    });

    this.products.push(product);

    return product;
  }

  public async findById(productId: string): Promise<Product | undefined> {
    return this.products.find(product => product.id === productId);
  }
}

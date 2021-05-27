import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

import IProductsRepository from '../repositories/IProductsRepository';
import Product from '../infra/database/typeorm/entities/Product';

interface IRequest {
  productId: string;
  quantityToBeAdded: number;
}

@injectable()
export default class AddQuantityToProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    productId,
    quantityToBeAdded,
  }: IRequest): Promise<Product> {
    const cacheKey = `products-list`;

    const findProduct = await this.productsRepository.findById(productId);

    if (!findProduct) {
      throw new AppError('Product not found!', 404);
    }

    if (quantityToBeAdded < 0) {
      throw new AppError('Negative values are not accepted!');
    }

    const updatedProduct = await this.productsRepository.addQuantityInStock(
      findProduct,
      quantityToBeAdded,
    );

    await this.cacheProvider.delete(cacheKey);

    return updatedProduct;
  }
}

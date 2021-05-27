import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

import IProductsRepositoryDTO from '../dtos/IProductsRepositoryDTO';
import Product from '../infra/database/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  productId: string;
  data: Partial<IProductsRepositoryDTO>;
}

@injectable()
export default class UpdateProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ data, productId }: IRequest): Promise<Product> {
    const cacheKey = `products-list`;

    const findProduct = await this.productsRepository.findById(productId);

    if (!findProduct) {
      throw new AppError('Product not found!');
    }

    const updatedProduct = await this.productsRepository.edit(
      findProduct,
      data,
    );

    await this.cacheProvider.delete(cacheKey);

    return updatedProduct;
  }
}

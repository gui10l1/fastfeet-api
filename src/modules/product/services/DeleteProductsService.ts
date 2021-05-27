import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  productId: string;
}

@injectable()
export default class DeleteProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ productId }: IRequest): Promise<void> {
    const cacheKey = `products-list`;
    const findProduct = await this.productsRepository.findById(productId);

    if (!findProduct) {
      throw new AppError('Product not found!', 404);
    }

    await this.productsRepository.delete(findProduct);

    await this.cacheProvider.delete(cacheKey);
  }
}

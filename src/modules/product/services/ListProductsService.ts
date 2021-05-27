import { inject, injectable } from 'tsyringe';

import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

import { classToClass } from 'class-transformer';
import Product from '../infra/database/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

@injectable()
export default class ListProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<Product[]> {
    const cacheKey = `products-list`;

    const cachedProducts = await this.cacheProvider.get<Product[]>(cacheKey);

    if (!cachedProducts) {
      const products = await this.productsRepository.list();

      const parsedProducts = classToClass(products);

      await this.cacheProvider.save(cacheKey, JSON.stringify(parsedProducts));

      return parsedProducts;
    }

    return cachedProducts;
  }
}

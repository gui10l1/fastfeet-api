import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

import IProductsRepositoryDTO from '../dtos/IProductsRepositoryDTO';
import Product from '../infra/database/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

@injectable()
export default class CreateProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(data: IProductsRepositoryDTO): Promise<Product> {
    const cacheKey = `products-list`;

    if (data.quantityInStock <= 0) {
      throw new AppError('Product quantity needs to be different of zero!');
    }

    const product = await this.productsRepository.create(data);

    await this.storageProvider.saveFiles(data.photos);

    await this.cacheProvider.delete(cacheKey);

    return product;
  }
}

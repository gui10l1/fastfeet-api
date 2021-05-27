import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

import IProductsRepository from '../repositories/IProductsRepository';
import Product from '../infra/database/typeorm/entities/Product';

interface IRequest {
  productId: string;
  photos: Array<string>;
}

@injectable()
export default class AddPhotosToProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ productId, photos }: IRequest): Promise<Product> {
    const cacheKey = `products-list`;

    const findProduct = await this.productsRepository.findById(productId);

    if (!findProduct) {
      await this.storageProvider.deleteFiles(photos);
      throw new AppError('Product not found!');
    }

    const files = await this.storageProvider.saveFiles(photos);

    const updatedProduct = await this.productsRepository.addPhotos(
      findProduct,
      files,
    );

    await this.cacheProvider.delete(cacheKey);

    return updatedProduct;
  }
}

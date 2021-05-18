import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';

import IProductsRepository from '../repositories/IProductsRepository';
import Product from '../infra/database/typeorm/entities/Product';

interface IRequest {
  productId: string;
  photos: Array<string>;
}

@injectable()
export default class RemovePhotosFromProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ productId, photos }: IRequest): Promise<Product> {
    const findProduct = await this.productsRepository.findById(productId);

    if (!findProduct) {
      throw new AppError('Product not found!');
    }

    photos.forEach(photo => {
      const findPhoto = findProduct.photos.find(item => item === photo);

      if (!findPhoto) {
        throw new AppError('This photo does not exist!', 404);
      }
    });

    await this.storageProvider.deleteFiles(photos);

    const updatedProduct = await this.productsRepository.deletePhotos(
      findProduct,
      photos,
    );

    return updatedProduct;
  }
}

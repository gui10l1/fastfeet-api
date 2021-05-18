import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

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
  ) {}

  public async execute({ data, productId }: IRequest): Promise<Product> {
    const findProduct = await this.productsRepository.findById(productId);

    if (!findProduct) {
      throw new AppError('Product not found!');
    }

    const updatedProduct = await this.productsRepository.edit(
      findProduct,
      data,
    );

    return updatedProduct;
  }
}

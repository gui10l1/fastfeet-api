import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/user/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';
import IProductsRepository from '../repositories/IProductsRepository';
import Product from '../infra/database/typeorm/entities/Product';

interface IRequest {
  productId: string;
  userId: string;
  quantityToBeAdded: number;
}

@injectable()
export default class AddQuantityToProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    userId,
    productId,
    quantityToBeAdded,
  }: IRequest): Promise<Product> {
    const findUser = await this.usersRepository.findById(userId);

    if (!findUser) {
      throw new AppError('User not found!', 404);
    }

    if (findUser.deliveryman) {
      throw new AppError('You do not have permissions to do such action!', 403);
    }

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

    return updatedProduct;
  }
}

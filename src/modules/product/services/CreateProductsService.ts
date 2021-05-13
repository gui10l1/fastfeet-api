import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/user/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

import IProductsRepositoryDTO from '../dtos/IProductsRepositoryDTO';
import Product from '../infra/database/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  userId: string;
  data: IProductsRepositoryDTO;
}

@injectable()
export default class CreateProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId, data }: IRequest): Promise<Product> {
    const findUser = await this.usersRepository.findById(userId);

    if (!findUser) {
      throw new AppError('User not found!', 404);
    }

    if (findUser.deliveryman) {
      throw new AppError('You do not have permissions to do such action!', 403);
    }

    if (data.quantityInStock <= 0) {
      throw new AppError('Product quantity needs to be different of zero!');
    }

    const product = await this.productsRepository.create(data);

    return product;
  }
}

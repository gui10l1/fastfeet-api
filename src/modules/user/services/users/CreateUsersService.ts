import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/providers/HashProvider/models/IHashProvider';

import IUsersRepositoryDTO from '../../dtos/IUsersRepositoryDTO';
import User from '../../infra/database/typeorm/entities/User';
import IUsersRepository from '../../repositories/IUsersRepository';

interface IRequest {
  adminId?: string;
  data: IUsersRepositoryDTO;
}

@injectable()
export default class CreateUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ adminId, data }: IRequest): Promise<User> {
    if (data.deliveryMan !== undefined && !adminId) {
      throw new AppError('You do not have permission for this action!', 403);
    }

    if (adminId) {
      const findAdmin = await this.usersRepository.findById(adminId);

      if (!findAdmin) {
        throw new AppError('Admin not found!', 404);
      }

      if (findAdmin.deliveryman === true) {
        throw new AppError('You do not have permission for this action!', 403);
      }
    }

    const findUserByCpf = await this.usersRepository.findByCpf(data.cpf);

    if (findUserByCpf) {
      throw new AppError('There is already a user with this CPF');
    }

    const findUserByEmail = await this.usersRepository.findByEmail(data.email);

    if (findUserByEmail) {
      throw new AppError('There is already a user with this email');
    }

    const hashedPassword = await this.hashProvider.hash(data.password);

    const user = await this.usersRepository.create({
      ...data,
      password: hashedPassword,
    });

    return user;
  }
}

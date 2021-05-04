import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/providers/HashProvider/models/IHashProvider';
import { inject, injectable } from 'tsyringe';
import IUsersRepositoryDTO from '../dtos/IUsersRepositoryDTO';

import User from '../infra/database/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IUserData extends Partial<IUsersRepositoryDTO> {
  name: string;
}

interface IRequest {
  userId: string;
  data: IUserData;
}

@injectable()
export default class UpdateUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ userId, data }: IRequest): Promise<User> {
    const userToUpdate = await this.usersRepository.findById(userId);

    if (!userToUpdate) {
      throw new AppError('User not found!', 404);
    }

    if (data.email) {
      const findUserByEmail = await this.usersRepository.findByEmail(
        data.email,
      );

      if (findUserByEmail) {
        throw new AppError('This email is already used!');
      }
    }

    if (data.cpf) {
      const findUserByEmail = await this.usersRepository.findByEmail(data.cpf);

      if (findUserByEmail) {
        throw new AppError('This CPF is already used!');
      }
    }

    const userUpdated = await this.usersRepository.edit(userToUpdate, data);

    return userUpdated;
  }
}

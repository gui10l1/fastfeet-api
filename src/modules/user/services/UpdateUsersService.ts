import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/providers/HashProvider/models/IHashProvider';

import IUsersRepositoryDTO from '../dtos/IUsersRepositoryDTO';
import User from '../infra/database/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';

interface IUserData extends Partial<IUsersRepositoryDTO> {
  oldPassword?: string;
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

    if (data.email && data.email !== userToUpdate.email) {
      const findUserByEmail = await this.usersRepository.findByEmail(
        data.email,
      );

      if (findUserByEmail) {
        throw new AppError('This email is already used!');
      }
    }

    if (data.cpf) {
      const findUserByCpf = await this.usersRepository.findByCpf(data.cpf);

      if (findUserByCpf) {
        throw new AppError('This CPF is already used!');
      }
    }

    if (data.password && !data.oldPassword) {
      throw new AppError(
        'To changeyour password you need to provider your old one',
      );
    }

    if (data.oldPassword && data.password) {
      const passwordMatch = await this.hashProvider.compare(
        data.oldPassword,
        userToUpdate.password,
      );

      if (!passwordMatch) {
        throw new AppError("Old password doesn't match!");
      }

      const passwordHashed = await this.hashProvider.hash(data.password);

      const parsedData = {
        ...data,
        password: passwordHashed,
      };

      const userUpdated = await this.usersRepository.edit(
        userToUpdate,
        parsedData,
      );

      return userUpdated;
    }

    const userUpdated = await this.usersRepository.edit(userToUpdate, data);

    return userUpdated;
  }
}

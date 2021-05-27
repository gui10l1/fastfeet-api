import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';
import IUsersRepository from '../../repositories/IUsersRepository';

interface IRequest {
  userToDelete: string;
  userLogged: string;
}

@injectable()
export default class DeleteUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ userLogged, userToDelete }: IRequest): Promise<void> {
    if (userLogged === userToDelete) {
      const findUser = await this.usersRepository.findById(userToDelete);

      if (!findUser) {
        throw new AppError('User not found!', 404);
      }

      await this.usersRepository.delete(findUser);

      return;
    }

    const findAdminUser = await this.usersRepository.findById(userLogged);

    if (!findAdminUser) {
      throw new AppError('This admin user was not found!', 404);
    }

    if (findAdminUser.deliveryman) {
      throw new AppError('You do not have permission to do this action', 403);
    }

    const findUserToDelete = await this.usersRepository.findById(userToDelete);

    if (!findUserToDelete) {
      throw new AppError('User not found!', 404);
    }

    await this.usersRepository.delete(findUserToDelete);

    await this.cacheProvider.delete('users-list');
  }
}

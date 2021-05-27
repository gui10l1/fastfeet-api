import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';
import { inject, injectable } from 'tsyringe';

import User from '../../infra/database/typeorm/entities/User';
import IUsersRepository from '../../repositories/IUsersRepository';

@injectable()
export default class ListUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<User[]> {
    const usersCached = await this.cacheProvider.get<User[]>('users-list');

    if (!usersCached) {
      const users = await this.usersRepository.list();

      await this.cacheProvider.save(
        'users-list',
        JSON.stringify(classToClass(users)),
      );

      return users;
    }

    return usersCached;
  }
}

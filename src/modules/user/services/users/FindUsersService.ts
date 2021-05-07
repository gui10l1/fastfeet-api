import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '../../infra/database/typeorm/entities/User';
import IUsersRepository from '../../repositories/IUsersRepository';

interface IRequest {
  userId: string;
}

@injectable()
export default class FindUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ userId }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found!', 404);
    }

    return user;
  }
}

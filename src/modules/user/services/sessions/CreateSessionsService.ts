import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import authConfig from '@config/authConfig';

import User from '@modules/user/infra/database/typeorm/entities/User';
import IUsersRepository from '@modules/user/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/providers/HashProvider/models/IHashProvider';

interface IRequest {
  cpf: string;
  password: string;
}

interface IResponse {
  userLogged: User;
  token: string;
}

@injectable()
export default class CreateSessionsService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ cpf, password }: IRequest): Promise<IResponse> {
    const findUserByCpf = await this.usersRepository.findByCpf(cpf);

    if (!findUserByCpf) {
      throw new AppError('CPF/password does not match our records!');
    }

    const passwordsMatch = await this.hashProvider.compare(
      password,
      findUserByCpf.password,
    );

    if (!passwordsMatch) {
      throw new AppError('CPF/password does not match our records!');
    }

    const token = sign({}, authConfig.secret, {
      subject: findUserByCpf.id,
      expiresIn: authConfig.expiresIn,
    });

    return {
      token,
      userLogged: findUserByCpf,
    };
  }
}

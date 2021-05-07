import { inject, injectable } from 'tsyringe';
import { sign } from 'jsonwebtoken';

import IClientsRepository from '@modules/client/repositories/IClientsRepository';
import IHashProvider from '@shared/providers/HashProvider/models/IHashProvider';
import Client from '@modules/client/infra/database/typeorm/entities/Client';

import AppError from '@shared/errors/AppError';
import authConfig from '@config/authConfig';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  clientLogged: Client;
  token: string;
}

@injectable()
export default class CreateSessionsService {
  constructor(
    @inject('ClientsRepository')
    private clientsRepository: IClientsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const findClientByEmail = await this.clientsRepository.findByEmail(email);

    if (!findClientByEmail) {
      throw new AppError('Email/password does not match our records!');
    }

    const passwordsMatch = await this.hashProvider.compare(
      password,
      findClientByEmail.password,
    );

    if (!passwordsMatch) {
      throw new AppError('Email/password does not match our records!');
    }

    const token = sign({}, authConfig.secret, {
      subject: findClientByEmail.id,
      expiresIn: authConfig.expiresIn,
    });

    return {
      token,
      clientLogged: findClientByEmail,
    };
  }
}

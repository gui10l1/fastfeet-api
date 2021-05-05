import { inject, injectable } from 'tsyringe';

import IHashProvider from '@shared/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';

import Client from '../infra/database/typeorm/entities/Client';
import IClientsRepository from '../repositories/IClientsRepository';
import IClientsRepositoryDTO from '../dtos/IClientsRepositoryDTO';

@injectable()
export default class CreateClientsService {
  constructor(
    @inject('ClientsRepository')
    private clientsRepository: IClientsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    password,
    ...rest
  }: IClientsRepositoryDTO): Promise<Client> {
    const findClientByEmail = await this.clientsRepository.findByEmail(email);

    if (findClientByEmail) {
      throw new AppError('There is a account using this email');
    }

    const hashedPassword = await this.hashProvider.hash(password);

    const client = await this.clientsRepository.create({
      email,
      password: hashedPassword,
      ...rest,
    });

    return client;
  }
}

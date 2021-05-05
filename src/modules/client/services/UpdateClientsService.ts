import { inject, injectable } from 'tsyringe';

import IHashProvider from '@shared/providers/HashProvider/models/IHashProvider';

import AppError from '@shared/errors/AppError';
import IClientsRepository from '../repositories/IClientsRepository';
import IClientsRepositoryDTO from '../dtos/IClientsRepositoryDTO';
import Client from '../infra/database/typeorm/entities/Client';

interface IClientData extends Partial<IClientsRepositoryDTO> {
  oldPassword?: string;
}

interface IRequest {
  clientLogged: string;
  clientToBeUpdated: string;
  data: IClientData;
}

@injectable()
export default class UpdateClientsService {
  constructor(
    @inject('ClientsRepository')
    private clientsRepository: IClientsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    clientLogged,
    clientToBeUpdated,
    data,
  }: IRequest): Promise<Client> {
    if (clientLogged !== clientToBeUpdated) {
      throw new AppError("You can't update another client account!", 403);
    }

    const findClientToBeUpdated = await this.clientsRepository.findById(
      clientToBeUpdated,
    );

    if (!findClientToBeUpdated) {
      throw new AppError("You can't update a client that does not exist");
    }

    return findClientToBeUpdated;
  }
}

import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import Client from '../../infra/database/typeorm/entities/Client';
import IClientsRepository from '../../repositories/IClientsRepository';

interface IRequest {
  clientId: string;
}

@injectable()
export default class FindClientsService {
  constructor(
    @inject('ClientsRepository')
    private clientsRepository: IClientsRepository,
  ) {}

  public async execute({ clientId }: IRequest): Promise<Client> {
    const findClient = await this.clientsRepository.findById(clientId);

    if (!findClient) {
      throw new AppError('Client not found', 404);
    }

    return findClient;
  }
}

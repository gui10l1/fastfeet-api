import { inject, injectable } from 'tsyringe';

import Client from '@modules/client/infra/database/typeorm/entities/Client';
import IClientsRepository from '@modules/client/repositories/IClientsRepository';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';

@injectable()
export default class ListClientsService {
  constructor(
    @inject('ClientsRepository')
    private clientsRepository: IClientsRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<Client[]> {
    const cacheKey = `clients-list`;
    const cachedValues = await this.cacheProvider.get<Client[]>(cacheKey);

    if (!cachedValues) {
      const clients = await this.clientsRepository.list();

      const parsedClients = classToClass(clients);

      await this.cacheProvider.save(cacheKey, JSON.stringify(parsedClients));

      return parsedClients;
    }

    return cachedValues;
  }
}

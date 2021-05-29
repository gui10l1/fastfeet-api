import { getRepository, Repository } from 'typeorm';

import IClientsRepositoryDTO from '@modules/client/dtos/IClientsRepositoryDTO';
import IClientsRepository from '@modules/client/repositories/IClientsRepository';

import Client from '../entities/Client';

export default class ClientsRepository implements IClientsRepository {
  private ormRepository: Repository<Client>;

  constructor() {
    this.ormRepository = getRepository(Client);
  }

  public async create(data: IClientsRepositoryDTO): Promise<Client> {
    const client = this.ormRepository.create({
      ...data,
      postal_code: data.postalCode,
    });

    await this.ormRepository.save(client);

    return client;
  }

  public async findById(id: string): Promise<Client | undefined> {
    return this.ormRepository.findOne({
      where: { id },
    });
  }

  public async findByEmail(email: string): Promise<Client | undefined> {
    return this.ormRepository.findOne({
      where: { email },
    });
  }

  public async update(
    client: Client,
    data: Partial<IClientsRepositoryDTO>,
  ): Promise<Client> {
    const updatedClient = this.ormRepository.merge(client, {
      ...data,
      postal_code: data.postalCode,
    });

    await this.ormRepository.save(updatedClient);

    return updatedClient;
  }

  public async list(): Promise<Client[]> {
    return this.ormRepository.find();
  }
}

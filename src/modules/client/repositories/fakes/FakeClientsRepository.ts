import { v4 } from 'uuid';

import IClientsRepositoryDTO from '@modules/client/dtos/IClientsRepositoryDTO';
import Client from '@modules/client/infra/database/typeorm/entities/Client';

import IClientsRepository from '../IClientsRepository';

export default class FakeClientsRepository implements IClientsRepository {
  private clients: Client[] = [];

  public async create(data: IClientsRepositoryDTO): Promise<Client> {
    const client = new Client();

    Object.assign(client, {
      id: v4(),
      ...data,
      postal_code: data.postalCode,
    });

    this.clients.push(client);

    return client;
  }

  public async findById(id: string): Promise<Client | undefined> {
    return this.clients.find(client => client.id === id);
  }

  public async findByEmail(email: string): Promise<Client | undefined> {
    return this.clients.find(client => client.email === email);
  }

  public async update(
    client: Client,
    data: Partial<IClientsRepositoryDTO>,
  ): Promise<Client> {
    const findClientIndex = this.clients.findIndex(
      item => item.id === client.id,
    );

    const updatedClient = Object.assign(client, {
      ...data,
      postal_code: data.postalCode,
    });

    this.clients[findClientIndex] = updatedClient;

    return updatedClient;
  }
}

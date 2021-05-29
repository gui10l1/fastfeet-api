import IClientsRepositoryDTO from '../dtos/IClientsRepositoryDTO';
import Client from '../infra/database/typeorm/entities/Client';

export default interface IClientsRepository {
  create(data: IClientsRepositoryDTO): Promise<Client>;
  findByEmail(email: string): Promise<Client | undefined>;
  findById(id: string): Promise<Client | undefined>;
  update(client: Client, data: Partial<IClientsRepositoryDTO>): Promise<Client>;
  list(): Promise<Client[]>;
}

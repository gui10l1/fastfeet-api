import IUsersRepositoryDTO from '../dtos/IUsersRepositoryDTO';
import User from '../infra/database/typeorm/entities/User';

export default interface IUsersRepository {
  create(data: IUsersRepositoryDTO): Promise<User>;
  findByCpf(cpf: string): Promise<User | undefined>;
  findByEmail(email: string): Promise<User | undefined>;
  findById(userId: string): Promise<User | undefined>;
  update(user: User, data: Partial<IUsersRepositoryDTO>): Promise<User>;
  list(): Promise<User[]>;
  delete(user: User): Promise<void>;
}

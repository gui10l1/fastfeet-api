import { getRepository, Repository } from 'typeorm';

import IUsersRepositoryDTO from '@modules/user/dtos/IUsersRepositoryDTO';
import IUsersRepository from '@modules/user/repositories/IUsersRepository';

import User from '../entities/User';

export default class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<User>;

  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async create(data: IUsersRepositoryDTO): Promise<User> {
    const user = this.ormRepository.create({
      ...data,
      deliveryman: data.deliveryMan,
    });

    await this.ormRepository.save(user);

    return user;
  }

  public async findByCpf(cpf: string): Promise<User | undefined> {
    return this.ormRepository.findOne({
      where: { cpf },
    });
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.ormRepository.findOne({
      where: { email },
    });
  }

  public async findById(userId: string): Promise<User | undefined> {
    return this.ormRepository.findOne({
      where: { id: userId },
    });
  }

  public async edit(
    user: User,
    data: Partial<IUsersRepositoryDTO>,
  ): Promise<User> {
    const userUpdated = this.ormRepository.merge(user, data);

    await this.ormRepository.save(userUpdated);

    return userUpdated;
  }

  public async list(): Promise<User[]> {
    return this.ormRepository.find();
  }

  public async delete(user: User): Promise<void> {
    await this.ormRepository.remove(user);
  }
}

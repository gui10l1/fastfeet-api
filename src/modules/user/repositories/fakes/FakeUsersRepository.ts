import { v4 } from 'uuid';

import IUsersRepositoryDTO from '@modules/user/dtos/IUsersRepositoryDTO';
import User from '@modules/user/infra/database/typeorm/entities/User';

import IUsersReposiry from '../IUsersRepository';

export default class FakeUsersRepository implements IUsersReposiry {
  private users: User[] = [];

  public async create({
    deliveryMan,
    ...rest
  }: IUsersRepositoryDTO): Promise<User> {
    const user = new User();

    if (deliveryMan !== undefined) {
      Object.assign(user, {
        id: v4(),
        deliveryman: deliveryMan,
        ...rest,
      });

      this.users.push(user);

      return user;
    }

    Object.assign(user, {
      id: v4(),
      deliveryman: true,
      ...rest,
    });

    this.users.push(user);

    return user;
  }

  public async findByCpf(cpf: string): Promise<User | undefined> {
    return this.users.find(user => user.cpf === cpf);
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  public async findById(userId: string): Promise<User | undefined> {
    return this.users.find(user => user.id === userId);
  }

  public async edit(
    user: User,
    data: Partial<IUsersRepositoryDTO>,
  ): Promise<User> {
    const userIndex = this.users.findIndex(findUser => findUser.id === user.id);

    const updatedUser = Object.assign(user, {
      ...data,
      deliveryman: data.deliveryMan,
    });

    this.users[userIndex] = updatedUser;

    return updatedUser;
  }

  public async list(): Promise<User[]> {
    return this.users;
  }
}

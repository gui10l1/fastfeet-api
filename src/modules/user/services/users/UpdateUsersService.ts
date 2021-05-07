import { inject, injectable } from 'tsyringe';
import path from 'path';

import AppError from '@shared/errors/AppError';
import IHashProvider from '@shared/providers/HashProvider/models/IHashProvider';

import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider';
import IUsersRepositoryDTO from '../../dtos/IUsersRepositoryDTO';
import User from '../../infra/database/typeorm/entities/User';
import IUsersRepository from '../../repositories/IUsersRepository';

interface IUserData extends Partial<IUsersRepositoryDTO> {
  oldPassword?: string;
}

interface IRequest {
  userToBeUpdated: string;
  userLogged: string;
  data: IUserData;
}

@injectable()
export default class UpdateUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({
    userToBeUpdated,
    userLogged,
    data,
  }: IRequest): Promise<User> {
    if (userToBeUpdated !== userLogged) {
      const adminUser = await this.usersRepository.findById(userLogged);

      if (!adminUser) {
        throw new AppError('This admin was not found!', 404);
      }

      if (adminUser.deliveryman) {
        throw new AppError('You do not permission to do this action!', 403);
      }
    }

    const userToUpdate = await this.usersRepository.findById(userToBeUpdated);

    if (!userToUpdate) {
      throw new AppError('User not found!', 404);
    }

    if (data.email && data.email !== userToUpdate.email) {
      const findUserByEmail = await this.usersRepository.findByEmail(
        data.email,
      );

      if (findUserByEmail) {
        throw new AppError('This email is already used!');
      }

      const templateFile = path.resolve(
        __dirname,
        '..',
        '..',
        'views',
        'mails',
        'confirm-updated-email-address.hbs',
      );

      await this.mailProvider.sendMail({
        subject: 'Your email has been updated. Confirm it',
        to: {
          emailAddress: data.email,
          name: data.name || userToUpdate.name,
        },
        template: {
          templateFile,
          variables: {
            name: data.name || userToUpdate.name,
            newEmail: data.email,
          },
        },
      });
    }

    if (data.cpf) {
      const findUserByCpf = await this.usersRepository.findByCpf(data.cpf);

      if (findUserByCpf) {
        throw new AppError('This CPF is already used!');
      }
    }

    if (data.password && !data.oldPassword) {
      throw new AppError(
        'To changeyour password you need to provider your old one',
      );
    }

    if (data.oldPassword && data.password) {
      const passwordMatch = await this.hashProvider.compare(
        data.oldPassword,
        userToUpdate.password,
      );

      if (!passwordMatch) {
        throw new AppError("Old password doesn't match!");
      }

      const passwordHashed = await this.hashProvider.hash(data.password);

      const parsedData = {
        ...data,
        password: passwordHashed,
      };

      const userUpdated = await this.usersRepository.update(
        userToUpdate,
        parsedData,
      );

      return userUpdated;
    }

    const userUpdated = await this.usersRepository.update(userToUpdate, data);

    return userUpdated;
  }
}

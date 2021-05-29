import { inject, injectable } from 'tsyringe';
import path from 'path';

import IHashProvider from '@shared/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

import IClientsRepository from '../../repositories/IClientsRepository';
import IClientsRepositoryDTO from '../../dtos/IClientsRepositoryDTO';
import Client from '../../infra/database/typeorm/entities/Client';

interface IClientData extends Partial<IClientsRepositoryDTO> {
  oldPassword?: string;
}

interface IRequest {
  clientLogged: string;
  data: IClientData;
}

@injectable()
export default class UpdateClientsService {
  constructor(
    @inject('ClientsRepository')
    private clientsRepository: IClientsRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ clientLogged, data }: IRequest): Promise<Client> {
    const cacheKey = `clients-list`;

    const findClientToBeUpdated = await this.clientsRepository.findById(
      clientLogged,
    );

    if (!findClientToBeUpdated) {
      throw new AppError("You can't update a client that does not exist");
    }

    if (data.email && data.email !== findClientToBeUpdated.email) {
      const checkIfEmailAlreadyExists = await this.clientsRepository.findByEmail(
        data.email,
      );

      if (checkIfEmailAlreadyExists) {
        throw new AppError('There is a client using this email!');
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
        subject: 'Confirm your updated email!',
        to: {
          emailAddress: data.email,
          name: data.name || findClientToBeUpdated.name,
        },
        template: {
          templateFile,
          variables: {
            clientName: data.name || findClientToBeUpdated.name,
          },
        },
      });
    }

    if (data.password && !data.oldPassword) {
      throw new AppError(
        'To change your password you need to provide your old one',
      );
    }

    if (data.password && data.oldPassword) {
      const oldPasswordMatch = await this.hashProvider.compare(
        data.oldPassword,
        findClientToBeUpdated.password,
      );

      if (!oldPasswordMatch) {
        throw new AppError('Old password does not match!');
      }

      const newPasswordHashed = await this.hashProvider.hash(data.password);

      const clientUpdated = await this.clientsRepository.update(
        findClientToBeUpdated,
        {
          ...data,
          password: newPasswordHashed,
        },
      );

      return clientUpdated;
    }

    const clientUpdated = await this.clientsRepository.update(
      findClientToBeUpdated,
      data,
    );

    await this.cacheProvider.delete(cacheKey);

    return clientUpdated;
  }
}

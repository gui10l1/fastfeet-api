import { inject, injectable } from 'tsyringe';
import path from 'path';

import IClientsRepository from '@modules/client/repositories/IClientsRepository';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider';

import IDeliveriesRepositoryDTO from '../../dtos/IDeliveriesRepositoryDTO';
import Delivery from '../../infra/database/typeorm/entities/Delivery';
import IDeliveriesRepository from '../../repositories/IDeliveriesRepository';

@injectable()
export default class CreateDeliveriesService {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,

    @inject('ClientsRepository')
    private clientRepository: IClientsRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute(data: IDeliveriesRepositoryDTO): Promise<Delivery> {
    const findClient = await this.clientRepository.findById(data.recipientId);

    if (!findClient) {
      throw new AppError('Client not found', 404);
    }

    const delivery = await this.deliveriesRepository.create(data);

    const templateFile = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'mails',
      'delivery-requested.hbs',
    );

    await this.mailProvider.sendMail({
      subject: 'Your delivery has been requested',
      to: {
        emailAddress: findClient.email,
        name: findClient.name,
      },
      template: {
        templateFile,
        variables: {
          clientName: findClient.name,
          product: data.product,
          postalCode: data.postalCode,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          address: data.address,
        },
      },
    });

    return delivery;
  }
}

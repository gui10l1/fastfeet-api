import { inject, injectable } from 'tsyringe';
import path from 'path';

import IDeliveriesRepository from '@modules/delivery/repositories/IDeliveriesRepository';
import IClientsRepository from '@modules/client/repositories/IClientsRepository';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider';

interface IRequest {
  deliveryId: string;
  clientId: string;
}

@injectable()
export default class CancelDeliveriesService {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,

    @inject('ClientsRepository')
    private clientsRepository: IClientsRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute({ deliveryId, clientId }: IRequest): Promise<void> {
    const findDelivery = await this.deliveriesRepository.findById(deliveryId);

    if (!findDelivery) {
      throw new AppError('Delivery not found!', 404);
    }

    const findClient = await this.clientsRepository.findById(clientId);

    if (!findClient) {
      throw new AppError('The client for this delivery was not found!', 404);
    }

    if (findClient.id !== findDelivery.recipient_id) {
      throw new AppError('This delivery was not requested by you!', 403);
    }

    const dateNow = Date.now();

    await this.deliveriesRepository.cancelDelivery(
      findDelivery,
      new Date(dateNow),
    );

    const templateFile = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'mails',
      'delivery-canceled.hbs',
    );

    await this.mailProvider.sendMail({
      subject: 'Cancelation order',
      to: {
        emailAddress: findClient.email,
        name: findClient.name,
      },
      template: {
        templateFile,
        variables: {
          clientName: findClient.name,
        },
      },
    });
  }
}

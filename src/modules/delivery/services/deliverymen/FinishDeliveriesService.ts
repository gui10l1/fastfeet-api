import { inject, injectable } from 'tsyringe';
import path from 'path';

import IClientsRepository from '@modules/client/repositories/IClientsRepository';
import IDeliveriesRepository from '@modules/delivery/repositories/IDeliveriesRepository';
import IUsersRepository from '@modules/user/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider';
import { format } from 'date-fns';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  deliveryId: string;
  deliveryManId: string;
  signaturePhotoFile: string;
}

@injectable()
export default class FinishDeliveriesService {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,

    @inject('ClientsRepository')
    private clientsRepository: IClientsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    deliveryId,
    deliveryManId,
    signaturePhotoFile,
  }: IRequest): Promise<void> {
    const findDelivery = await this.deliveriesRepository.findById(deliveryId);

    if (!findDelivery) {
      throw new AppError('Delivery not found!', 404);
    }

    const findDeliveryMan = await this.usersRepository.findById(deliveryManId);

    if (!findDeliveryMan) {
      throw new AppError('Delivery man not found!', 404);
    }

    if (findDelivery.deliveryman_id !== findDeliveryMan.id) {
      throw new AppError('This delivery does not belong to you!', 403);
    }

    if (!findDelivery.start_date) {
      throw new AppError('This delivery has not been withdrawn yet!', 403);
    }

    const findClient = await this.clientsRepository.findById(
      findDelivery.recipient_id,
    );

    if (!findClient) {
      throw new AppError('The client for this delivery was not found!', 404);
    }

    if (findDelivery.end_date) {
      throw new AppError('This delivery has already been finished!', 403);
    }

    const dateToday = Date.now();

    await this.deliveriesRepository.finishDelivery(
      findDelivery,
      new Date(dateToday),
      signaturePhotoFile,
    );

    await this.storageProvider.saveFile(signaturePhotoFile);

    const templateFile = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'mails',
      'delivery-finished.hbs',
    );

    const formattedDate = format(dateToday, 'dd/MM/yyyy');

    await this.mailProvider.sendMail({
      subject: 'Delivery finished!',
      to: {
        emailAddress: findClient.email,
        name: findClient.name,
      },
      template: {
        templateFile,
        variables: {
          clientName: findClient.name,
          date: formattedDate,
        },
      },
    });

    // await this.storageProvider.saveFile(signaturePhotoFile);
  }
}

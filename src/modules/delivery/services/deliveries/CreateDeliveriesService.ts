import { inject, injectable } from 'tsyringe';
import path from 'path';

import IClientsRepository from '@modules/client/repositories/IClientsRepository';
import AppError from '@shared/errors/AppError';
import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider';
import IProductsRepository from '@modules/product/repositories/IProductsRepository';

import IDeliveriesRepositoryDTO from '../../dtos/IDeliveriesRepositoryDTO';
import Delivery from '../../infra/database/typeorm/entities/Delivery';
import IDeliveriesRepository from '../../repositories/IDeliveriesRepository';

@injectable()
export default class CreateDeliveriesService {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,

    @inject('ClientsRepository')
    private clientsRepository: IClientsRepository,

    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,
  ) {}

  public async execute(data: IDeliveriesRepositoryDTO): Promise<Delivery> {
    const findClient = await this.clientsRepository.findById(data.recipientId);

    if (!findClient) {
      throw new AppError('Client not found', 404);
    }

    const findProduct = await this.productsRepository.findById(data.productId);

    if (!findProduct) {
      throw new AppError(
        'The product of this delivery request was not found!',
        404,
      );
    }

    if (data.productQuantity > findProduct.quantity_in_stock) {
      throw new AppError(
        'There is no enough quantity of this product in stock for this delivery',
      );
    }

    const delivery = await this.deliveriesRepository.create(data);

    await this.productsRepository.removeQuantityFromStock(
      findProduct,
      data.productQuantity,
    );

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
          product: findProduct.name,
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

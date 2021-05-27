import { inject, injectable } from 'tsyringe';

import Delivery from '@modules/delivery/infra/database/typeorm/entities/Delivery';
import IDeliveriesRepository from '@modules/delivery/repositories/IDeliveriesRepository';
import IUsersRepository from '@modules/user/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  deliveryManId: string;
}

@injectable()
export default class ListFinishedDeliveriesService {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({ deliveryManId }: IRequest): Promise<Delivery[]> {
    const findDeliveryMan = await this.usersRepository.findById(deliveryManId);

    if (!findDeliveryMan) {
      throw new AppError('Delivery man not found', 404);
    }

    if (findDeliveryMan.deliveryman === false) {
      throw new AppError('Invalid user');
    }

    const cacheKey = `delivery-man:${deliveryManId}:finished-deliveries`;
    const cachedDeliveries = await this.cacheProvider.get<Delivery[]>(cacheKey);

    if (!cachedDeliveries) {
      const finishedDeliveries = await this.deliveriesRepository.getDeliveryManFinishedDeliveries(
        deliveryManId,
      );

      await this.cacheProvider.save(
        cacheKey,
        JSON.stringify(finishedDeliveries),
      );

      return finishedDeliveries;
    }

    return cachedDeliveries;
  }
}

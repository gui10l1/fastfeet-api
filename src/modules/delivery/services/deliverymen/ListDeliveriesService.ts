import { inject, injectable } from 'tsyringe';

import Delivery from '@modules/delivery/infra/database/typeorm/entities/Delivery';
import IDeliveriesRepository from '@modules/delivery/repositories/IDeliveriesRepository';
import IUsersRepository from '@modules/user/repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';
import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
  deliveryManId: string;
  relations?: string[];
}

@injectable()
export default class ListDeliveriesService {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute({
    deliveryManId,
    relations,
  }: IRequest): Promise<Delivery[]> {
    const cacheKey = `delivery-man:${deliveryManId}:deliveries`;

    if (relations) {
      await this.cacheProvider.delete(cacheKey);
    }

    const findDeliveryMan = await this.usersRepository.findById(deliveryManId);

    if (!findDeliveryMan) {
      throw new AppError('Delivery man not found', 404);
    }

    if (!findDeliveryMan.deliveryman) {
      throw new AppError('Invalid user!', 403);
    }

    const cachedDeliveries = await this.cacheProvider.get<Delivery[]>(cacheKey);

    if (!cachedDeliveries) {
      const deliveries = await this.deliveriesRepository.getDeliveryManDeliveries(
        deliveryManId,
        relations,
      );

      await this.cacheProvider.save(cacheKey, JSON.stringify(deliveries));

      return deliveries;
    }

    return cachedDeliveries;
  }
}

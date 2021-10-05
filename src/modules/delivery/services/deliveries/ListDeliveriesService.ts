import { classToClass } from 'class-transformer';
import { inject, injectable } from 'tsyringe';

import Delivery from '@modules/delivery/infra/database/typeorm/entities/Delivery';
import IDeliveriesRepository from '@modules/delivery/repositories/IDeliveriesRepository';

import ICacheProvider from '@shared/providers/CacheProvider/models/ICacheProvider';

@injectable()
export default class ListDeliveriesService {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {}

  public async execute(): Promise<Delivery[]> {
    const cacheKey = `deliveries:requests:list`;

    const cachedValues = await this.cacheProvider.get<Delivery[]>(cacheKey);

    if (!cachedValues) {
      const deliveries = await this.deliveriesRepository.list();

      const parsedDeliveries = classToClass(deliveries);

      await this.cacheProvider.save(cacheKey, JSON.stringify(parsedDeliveries));

      return parsedDeliveries;
    }

    return cachedValues;
  }
}

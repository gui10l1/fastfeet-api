import { inject, injectable } from 'tsyringe';

import IDeliveriesRepository from '@modules/delivery/repositories/IDeliveriesRepository';
import IUsersRepository from '@modules/user/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import Delivery from '@modules/delivery/infra/database/typeorm/entities/Delivery';

interface IRequest {
  deliveryManId: string;
}

@injectable()
export default class ListDeliveriesService {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ deliveryManId }: IRequest): Promise<Delivery[]> {
    const findDeliveryMan = await this.usersRepository.findById(deliveryManId);

    if (!findDeliveryMan) {
      throw new AppError('Delivery man not found', 404);
    }

    if (!findDeliveryMan.deliveryman) {
      throw new AppError('Invalid user!', 403);
    }

    const deliveries = await this.deliveriesRepository.getDeliveryManDeliveries(
      deliveryManId,
    );

    return deliveries;
  }
}

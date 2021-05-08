import { inject, injectable } from 'tsyringe';

import Delivery from '@modules/delivery/infra/database/typeorm/entities/Delivery';
import IDeliveriesRepository from '@modules/delivery/repositories/IDeliveriesRepository';
import IUsersRepository from '@modules/user/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

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
  ) {}

  public async execute({ deliveryManId }: IRequest): Promise<Delivery[]> {
    const findDeliveryMan = await this.usersRepository.findById(deliveryManId);

    if (!findDeliveryMan) {
      throw new AppError('Delivery man not found', 404);
    }

    if (findDeliveryMan.deliveryman === false) {
      throw new AppError('Invalid user');
    }

    const finishedDeliveries = await this.deliveriesRepository.getDeliveryManFinishedDeliveries(
      deliveryManId,
    );

    return finishedDeliveries;
  }
}

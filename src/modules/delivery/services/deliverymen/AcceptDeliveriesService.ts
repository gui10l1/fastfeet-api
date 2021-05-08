import { inject, injectable } from 'tsyringe';

import IDeliveriesRepository from '@modules/delivery/repositories/IDeliveriesRepository';
import IUsersRepository from '@modules/user/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  deliveryId: string;
  deliveryManId: string;
}

@injectable()
export default class AcceptDeliveriesService {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ deliveryId, deliveryManId }: IRequest): Promise<void> {
    const findDeliveryMan = await this.usersRepository.findById(deliveryManId);

    if (!findDeliveryMan) {
      throw new AppError('Delivery man not found!', 404);
    }

    if (findDeliveryMan.deliveryman === false) {
      throw new AppError('Administrators are not delivery men!');
    }

    const findDelivery = await this.deliveriesRepository.findById(deliveryId);

    if (!findDelivery) {
      throw new AppError('Delivery not found!', 404);
    }

    if (findDelivery.deliveryman_id) {
      throw new AppError(
        'This delivery has already been accepted by another delivery man',
      );
    }

    return this.deliveriesRepository.acceptDelivery(
      findDelivery,
      findDeliveryMan.id,
    );
  }
}

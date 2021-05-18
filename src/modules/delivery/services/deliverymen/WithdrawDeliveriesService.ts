import { inject, injectable } from 'tsyringe';
import { getHours } from 'date-fns';

import IDeliveriesRepository from '@modules/delivery/repositories/IDeliveriesRepository';
import IUsersRepository from '@modules/user/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  deliveryId: string;
  deliveryManId: string;
}

@injectable()
export default class WithdrawDeliveriesService {
  constructor(
    @inject('DeliveriesRepository')
    private deliveriesRepository: IDeliveriesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({ deliveryId, deliveryManId }: IRequest): Promise<void> {
    const findDelivery = await this.deliveriesRepository.findById(deliveryId);

    if (!findDelivery) {
      throw new AppError('Delivery not found', 404);
    }

    const findDeliveryMan = await this.usersRepository.findById(deliveryManId);

    if (!findDeliveryMan) {
      throw new AppError('Delivery man not found!', 404);
    }

    if (findDelivery.deliveryman_id !== findDeliveryMan.id) {
      throw new AppError('This delivery has not been accepted by you!', 403);
    }

    const dateFromToday = Date.now();

    const hoursNow = getHours(dateFromToday);

    if (hoursNow < 8 || hoursNow > 12) {
      throw new AppError(
        'You are allowed to withdraw deliveries between 8am and 12pm',
      );
    }

    await this.deliveriesRepository.withdrawDelivery(
      findDelivery,
      new Date(dateFromToday),
    );
  }
}

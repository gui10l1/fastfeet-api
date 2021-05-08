import { v4 } from 'uuid';

import IDeliveriesRepositoryDTO from '@modules/delivery/dtos/IDeliveriesRepositoryDTO';
import Delivery from '@modules/delivery/infra/database/typeorm/entities/Delivery';

import IDeliveriesRepository from '../IDeliveriesRepository';

export default class FakeDeliveriesRepository implements IDeliveriesRepository {
  private deliveries: Delivery[] = [];

  public async create(data: IDeliveriesRepositoryDTO): Promise<Delivery> {
    const delivery = new Delivery();

    Object.assign(delivery, {
      id: v4(),
      recipient_id: data.recipientId,
      postal_code: data.postalCode,
      ...data,
    });

    this.deliveries.push(delivery);

    return delivery;
  }

  public async findById(deliveryId: string): Promise<Delivery | undefined> {
    return this.deliveries.find(delivery => delivery.id === deliveryId);
  }

  public async getDeliveryManDeliveries(
    deliveryManId: string,
  ): Promise<Delivery[]> {
    return this.deliveries.filter(
      delivery =>
        delivery.created_at === null &&
        delivery.end_date === null &&
        delivery.deliveryman_id === deliveryManId,
    );
  }

  public async getDeliveryManFinishedDeliveries(
    deliveryManId: string,
  ): Promise<Delivery[]> {
    return this.deliveries.filter(
      delivery =>
        delivery.deliveryman_id === deliveryManId && delivery.end_date,
    );
  }

  public async withdrawDelivery(
    delivery: Delivery,
    withdrawDate: Date,
  ): Promise<Delivery> {
    const findDeliveryIndex = this.deliveries.findIndex(
      item => item.id === delivery.id,
    );

    Object.assign(delivery, {
      start_date: withdrawDate,
    });

    this.deliveries[findDeliveryIndex] = delivery;

    return delivery;
  }

  public async cancelDelivery(
    delivery: Delivery,
    cancelDate: Date,
  ): Promise<Delivery> {
    const findDeliveryIndex = this.deliveries.findIndex(
      item => item.id === delivery.id,
    );

    Object.assign(delivery, {
      canceled_at: cancelDate,
    });

    this.deliveries[findDeliveryIndex] = delivery;

    return delivery;
  }

  public async finishDelivery(
    delivery: Delivery,
    finishDate: Date,
  ): Promise<Delivery> {
    const findDeliveryIndex = this.deliveries.findIndex(
      item => item.id === delivery.id,
    );

    Object.assign(delivery, {
      end_date: finishDate,
    });

    this.deliveries[findDeliveryIndex] = delivery;

    return delivery;
  }

  public async acceptDelivery(
    delivery: Delivery,
    deliveryManId: string,
  ): Promise<void> {
    const findDeliveryIndex = this.deliveries.findIndex(
      item => item.id === delivery.id,
    );

    Object.assign(delivery, {
      deliveryman_id: deliveryManId,
    });

    this.deliveries[findDeliveryIndex] = delivery;
  }
}

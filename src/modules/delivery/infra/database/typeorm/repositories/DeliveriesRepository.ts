import IDeliveriesRepositoryDTO from '@modules/delivery/dtos/IDeliveriesRepositoryDTO';
import IDeliveriesRepository from '@modules/delivery/repositories/IDeliveriesRepository';
import { getRepository, IsNull, Not, Repository } from 'typeorm';
import Delivery from '../entities/Delivery';

export default class DeliveriesRepository implements IDeliveriesRepository {
  private ormRepository: Repository<Delivery>;

  constructor() {
    this.ormRepository = getRepository(Delivery);
  }

  public async create(data: IDeliveriesRepositoryDTO): Promise<Delivery> {
    const delivery = this.ormRepository.create({
      ...data,
      product_id: data.productId,
      product_quantity: data.productQuantity,
      recipient_id: data.recipientId,
      postal_code: data.postalCode,
    });

    await this.ormRepository.save(delivery);

    return delivery;
  }

  public async findById(deliveryId: string): Promise<Delivery | undefined> {
    return this.ormRepository.findOne({
      where: { id: deliveryId },
    });
  }

  public async cancelDelivery(
    delivery: Delivery,
    cancelDate: Date,
  ): Promise<Delivery> {
    const canceledDelivery = this.ormRepository.merge(delivery, {
      canceled_at: cancelDate,
    });

    await this.ormRepository.save(canceledDelivery);

    return canceledDelivery;
  }

  public async withdrawDelivery(
    delivery: Delivery,
    withdrawDate: Date,
  ): Promise<Delivery> {
    const withdrawnDelivery = this.ormRepository.merge(delivery, {
      start_date: withdrawDate,
    });

    await this.ormRepository.save(withdrawnDelivery);

    return withdrawnDelivery;
  }

  public async finishDelivery(
    delivery: Delivery,
    finishDate: Date,
    signatureId: string,
  ): Promise<Delivery> {
    const finishedDelivery = this.ormRepository.merge(delivery, {
      end_date: finishDate,
      signature_id: signatureId,
    });

    await this.ormRepository.save(finishedDelivery);

    return finishedDelivery;
  }

  public async getDeliveryManDeliveries(
    deliveryManId: string,
  ): Promise<Delivery[]> {
    return this.ormRepository.find({
      where: {
        deliveryman_id: deliveryManId,
        end_date: null,
        canceled_at: null,
      },
    });
  }

  public async getDeliveryManFinishedDeliveries(
    deliveryManId: string,
  ): Promise<Delivery[]> {
    return this.ormRepository.find({
      where: {
        deliveryman_id: deliveryManId,
        end_date: Not(IsNull()),
      },
    });
  }

  public async acceptDelivery(
    delivery: Delivery,
    deliveryManId: string,
  ): Promise<void> {
    const acceptedDelivery = this.ormRepository.merge(delivery, {
      deliveryman_id: deliveryManId,
    });

    await this.ormRepository.save(acceptedDelivery);
  }
}

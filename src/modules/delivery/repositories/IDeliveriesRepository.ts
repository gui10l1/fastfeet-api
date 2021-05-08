import IDeliveriesRepositoryDTO from '../dtos/IDeliveriesRepositoryDTO';
import Delivery from '../infra/database/typeorm/entities/Delivery';

export default interface IDeliveriesRepository {
  create(data: IDeliveriesRepositoryDTO): Promise<Delivery>;
  cancelDelivery(delivery: Delivery, cancelDate: Date): Promise<Delivery>;
  withdrawDelivery(delivery: Delivery, withdrawDate: Date): Promise<Delivery>;
  finishDelivery(
    delivery: Delivery,
    finishDate: Date,
    signatureId: string,
  ): Promise<Delivery>;
  findById(deliveryId: string): Promise<Delivery | undefined>;
  getDeliveryManDeliveries(deliveryManId: string): Promise<Delivery[]>;
  getDeliveryManFinishedDeliveries(deliveryManId: string): Promise<Delivery[]>;
  acceptDelivery(delivery: Delivery, deliveryManId: string): Promise<void>;
}

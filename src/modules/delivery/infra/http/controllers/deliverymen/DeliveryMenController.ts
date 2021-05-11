import ListDeliveriesService from '@modules/delivery/services/deliverymen/ListDeliveriesService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class DeliveryMenController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { id: deliveryManId } = req.user;

    const service = container.resolve(ListDeliveriesService);

    const deliveries = await service.execute({
      deliveryManId,
    });

    const response = classToClass(deliveries);

    return res.status(200).json(response);
  }
}

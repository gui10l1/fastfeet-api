import CancelDeliveriesService from '@modules/delivery/services/deliveries/CancelDeliveryService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class CancelDeliveriesController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { deliveryId } = req.params;
    const { id: clientId } = req.user;

    const service = container.resolve(CancelDeliveriesService);

    await service.execute({
      clientId,
      deliveryId,
    });

    return res.status(200).send();
  }
}

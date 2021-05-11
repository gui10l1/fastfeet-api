import AcceptDeliveriesService from '@modules/delivery/services/deliverymen/AcceptDeliveriesService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class AcceptDeliveriesController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { deliveryId } = req.params;
    const { id: deliveryManId } = req.user;

    const service = container.resolve(AcceptDeliveriesService);

    await service.execute({
      deliveryId,
      deliveryManId,
    });

    return res.status(200).send();
  }
}

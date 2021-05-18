import WithdrawDeliveriesService from '@modules/delivery/services/deliverymen/WithdrawDeliveriesService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class WithdrawDeliveriesController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { deliveryId } = req.params;
    const { id: deliveryManId } = req.user;

    const service = container.resolve(WithdrawDeliveriesService);

    await service.execute({
      deliveryId,
      deliveryManId,
    });

    return res.status(200).send();
  }
}

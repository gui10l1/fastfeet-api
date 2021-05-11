import FinishDeliveriesService from '@modules/delivery/services/deliverymen/FinishDeliveriesService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class FinishDeliveriesController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { deliveryId } = req.params;
    const { id: deliveryManId } = req.user;
    const { filename } = req.file;

    const service = container.resolve(FinishDeliveriesService);

    await service.execute({
      deliveryId,
      deliveryManId,
      signaturePhotoFile: filename,
    });

    return res.status(200).send();
  }
}

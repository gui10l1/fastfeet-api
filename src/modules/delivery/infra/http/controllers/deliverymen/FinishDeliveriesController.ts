import FinishDeliveriesService from '@modules/delivery/services/deliverymen/FinishDeliveriesService';
import AppError from '@shared/errors/AppError';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class FinishDeliveriesController {
  public async index(req: Request, res: Response): Promise<Response> {
    const { deliveryId } = req.params;
    const { id: deliveryManId } = req.user;
    const signaturePhoto = req.file;

    if (!signaturePhoto) {
      throw new AppError("You must upload the photo of recipient's signature");
    }

    const service = container.resolve(FinishDeliveriesService);

    await service.execute({
      deliveryId,
      deliveryManId,
      signaturePhotoFile: signaturePhoto.filename,
    });

    return res.status(200).send();
  }
}

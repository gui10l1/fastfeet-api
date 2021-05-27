import CreateDeliveriesService from '@modules/delivery/services/deliveries/CreateDeliveriesService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class DeliveriesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      postalCode,
      address,
      neighborhood,
      city,
      state,
      productId,
      productQuantity,
    } = req.body;
    const { id: recipientId } = req.user;

    const service = container.resolve(CreateDeliveriesService);

    const delivery = await service.execute({
      address,
      city,
      neighborhood,
      postalCode,
      productId,
      recipientId,
      state,
      productQuantity,
    });

    const response = classToClass(delivery);

    return res.status(201).json(response);
  }
}

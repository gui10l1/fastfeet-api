import CreateDeliveriesService from '@modules/delivery/services/deliveries/CreateDeliveriesService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class DeliveriesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const {
      postalCode,
      product,
      address,
      neighborhood,
      city,
      state,
    } = req.body;
    const { id: recipientId } = req.user;

    const service = container.resolve(CreateDeliveriesService);

    const delivery = await service.execute({
      address,
      city,
      neighborhood,
      postalCode,
      product,
      recipientId,
      state,
    });

    const response = classToClass(delivery);

    return res.status(201).json(response);
  }
}

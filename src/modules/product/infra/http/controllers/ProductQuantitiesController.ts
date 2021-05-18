import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AddQuantityToProductsService from '@modules/product/services/AddQuantityToProductsService';
import RemoveQuantityFromProductsService from '@modules/product/services/RemoveQuantityFromProductsService';

export default class ProductQuantitiesController {
  public async create(req: Request, res: Response): Promise<Response> {
    const { quantity } = req.body;
    const { productId } = req.params;

    const service = container.resolve(AddQuantityToProductsService);

    const product = await service.execute({
      quantityToBeAdded: quantity,
      productId,
    });

    return res.status(201).json(product);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { quantity } = req.body;
    const { productId } = req.params;

    const service = container.resolve(RemoveQuantityFromProductsService);

    const product = await service.execute({
      quantityToBeRemoved: quantity,
      productId,
    });

    return res.json(product);
  }
}

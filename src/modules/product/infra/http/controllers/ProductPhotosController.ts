import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AddPhotosToProductsService from '@modules/product/services/AddPhotosToProductsService';
import RemovePhotosFromProductsService from '@modules/product/services/RemovePhotosFromProductsService';

export default class ProductPhotosController {
  public async create(req: Request, res: Response): Promise<Response> {
    const photos = req.files as Express.Multer.File[];
    const { productId } = req.params;

    const filenames = photos.map(photo => photo.filename);

    const service = container.resolve(AddPhotosToProductsService);

    const product = await service.execute({
      photos: filenames,
      productId,
    });

    return res.status(201).json(product);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { photos } = req.body;
    const { productId } = req.params;

    const service = container.resolve(RemovePhotosFromProductsService);

    const product = await service.execute({
      photos,
      productId,
    });

    return res.json(product);
  }
}

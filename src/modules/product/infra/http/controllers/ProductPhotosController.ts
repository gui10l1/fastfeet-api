import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AddPhotosToProductsService from '@modules/product/services/AddPhotosToProductsService';
import RemovePhotosFromProductsService from '@modules/product/services/RemovePhotosFromProductsService';
import AppError from '@shared/errors/AppError';
import { classToClass } from 'class-transformer';

export default class ProductPhotosController {
  public async create(req: Request, res: Response): Promise<Response> {
    const photos = req.files as Express.Multer.File[];
    const { productId } = req.params;

    if (photos.length === 0) {
      throw new AppError('You must upload, at least, one photo!');
    }

    const filenames = photos.map(photo => photo.filename);

    const service = container.resolve(AddPhotosToProductsService);

    const product = await service.execute({
      photos: filenames,
      productId,
    });

    const response = classToClass(product);

    return res.status(201).json(response);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { photos } = req.body;
    const { productId } = req.params;

    const service = container.resolve(RemovePhotosFromProductsService);

    const product = await service.execute({
      photos,
      productId,
    });

    const response = classToClass(product);

    return res.json(response);
  }
}

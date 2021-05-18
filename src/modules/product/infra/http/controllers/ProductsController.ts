import CreateProductsService from '@modules/product/services/CreateProductsService';
import UpdateProductsService from '@modules/product/services/UpdateProductsService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProductsController {
  public async create(req: Request, res: Response): Promise<Response> {
    const data = req.body;
    const photos = req.files as Express.Multer.File[];

    const filenames = photos.map(photo => photo.filename);

    const service = container.resolve(CreateProductsService);

    const product = await service.execute({
      ...data,
      photos: filenames,
    });

    return res.status(201).json(product);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { productId } = req.params;
    const data = req.body;

    const service = container.resolve(UpdateProductsService);

    const product = await service.execute({
      data,
      productId,
    });

    return res.json(product);
  }
}

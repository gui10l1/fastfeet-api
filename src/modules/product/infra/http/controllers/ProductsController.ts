import CreateProductsService from '@modules/product/services/CreateProductsService';
import DeleteProductsService from '@modules/product/services/DeleteProductsService';
import FindProductsService from '@modules/product/services/FindProductsService';
import ListProductsService from '@modules/product/services/ListProductsService';
import UpdateProductsService from '@modules/product/services/UpdateProductsService';
import { classToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ProductsController {
  public async index(req: Request, res: Response): Promise<Response> {
    const service = container.resolve(ListProductsService);

    const products = await service.execute();

    return res.json(products);
  }

  public async find(req: Request, res: Response): Promise<Response> {
    const { productId } = req.params;

    const service = container.resolve(FindProductsService);

    const product = await service.execute({
      productId,
    });

    const response = classToClass(product);

    return res.json(response);
  }

  public async create(req: Request, res: Response): Promise<Response> {
    const data = req.body;
    const photos = req.files as Express.Multer.File[];

    const filenames = photos.map(photo => photo.filename);

    const service = container.resolve(CreateProductsService);

    const product = await service.execute({
      ...data,
      photos: filenames,
    });

    const response = classToClass(product);

    return res.status(201).json(response);
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const { productId } = req.params;
    const data = req.body;

    const service = container.resolve(UpdateProductsService);

    const product = await service.execute({
      data,
      productId,
    });

    const response = classToClass(product);

    return res.json(response);
  }

  public async delete(req: Request, res: Response): Promise<Response> {
    const { productId } = req.params;

    const service = container.resolve(DeleteProductsService);

    await service.execute({ productId });

    return res.status(201).send();
  }
}

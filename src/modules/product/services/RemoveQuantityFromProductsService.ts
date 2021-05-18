import AppError from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';
import Product from '../infra/database/typeorm/entities/Product';
import IProductsRepository from '../repositories/IProductsRepository';

interface IRequest {
  productId: string;
  quantityToBeRemoved: number;
}

@injectable()
export default class RemoveQuantityFromProductsService {
  constructor(
    @inject('ProductsRepository')
    private productsRepository: IProductsRepository,
  ) {}

  public async execute({
    productId,
    quantityToBeRemoved,
  }: IRequest): Promise<Product> {
    const findProduct = await this.productsRepository.findById(productId);

    if (!findProduct) {
      throw new AppError('Product not found!', 404);
    }

    if (findProduct.quantity_in_stock === 0) {
      throw new AppError('This product has no quantity in stock!', 403);
    }

    const quantityRest = findProduct.quantity_in_stock - quantityToBeRemoved;

    if (quantityRest < 0) {
      const parsedQuantityToBeRemoved = quantityToBeRemoved + quantityRest;

      findProduct.quantity_in_stock = parsedQuantityToBeRemoved;

      const updatedProduct = await this.productsRepository.removeQuantityFromStock(
        findProduct,
        parsedQuantityToBeRemoved,
      );

      return updatedProduct;
    }

    const updatedProduct = await this.productsRepository.removeQuantityFromStock(
      findProduct,
      quantityToBeRemoved,
    );

    return updatedProduct;
  }
}

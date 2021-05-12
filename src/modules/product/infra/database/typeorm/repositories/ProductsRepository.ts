import { getRepository, Repository } from 'typeorm';

import IProductsRepositoryDTO from '@modules/product/dtos/IProductsRepositoryDTO';
import IProductsRepository from '@modules/product/repositories/IProductsRepository';

import Product from '../entities/Product';

export default class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create(data: IProductsRepositoryDTO): Promise<Product> {
    const product = this.ormRepository.create({
      ...data,
      quantity_in_stock: data.quantityInStock,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findById(productId: string): Promise<Product | undefined> {
    return this.ormRepository.findOne({
      where: { id: productId },
    });
  }
}

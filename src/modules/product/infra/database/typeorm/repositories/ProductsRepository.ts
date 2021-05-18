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

  public async addPhotos(product: Product, photos: string[]): Promise<Product> {
    product.photos.push(...photos);

    await this.ormRepository.save(product);

    return product;
  }

  public async addQuantityInStock(
    product: Product,
    quantity: number,
  ): Promise<Product> {
    const updatedProduct = this.ormRepository.merge(product, {
      quantity_in_stock: product.quantity_in_stock + quantity,
    });

    await this.ormRepository.save(updatedProduct);

    return updatedProduct;
  }

  public async removeQuantityFromStock(
    product: Product,
    quantity: number,
  ): Promise<Product> {
    const updatedProduct = this.ormRepository.merge(product, {
      quantity_in_stock: product.quantity_in_stock - quantity,
    });

    await this.ormRepository.save(updatedProduct);

    return updatedProduct;
  }

  public async edit(
    product: Product,
    data: Partial<IProductsRepositoryDTO>,
  ): Promise<Product> {
    const updatedProduct = this.ormRepository.merge(product, {
      quantity_in_stock: data.quantityInStock,
      ...data,
    });

    await this.ormRepository.save(updatedProduct);

    return updatedProduct;
  }

  public async deletePhotos(
    product: Product,
    photos: string[],
  ): Promise<Product> {
    photos.forEach(photo => {
      const findPhotoIndex = product.photos.findIndex(item => item === photo);

      product.photos.splice(findPhotoIndex, 1);
    });

    await this.ormRepository.save(product);

    return product;
  }
}

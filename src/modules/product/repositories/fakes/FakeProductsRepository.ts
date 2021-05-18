import { v4 } from 'uuid';

import IProductsRepositoryDTO from '@modules/product/dtos/IProductsRepositoryDTO';
import Product from '@modules/product/infra/database/typeorm/entities/Product';

import IProductsRepository from '../IProductsRepository';

export default class FakeProductsRepository implements IProductsRepository {
  private products: Product[] = [];

  public async create(data: IProductsRepositoryDTO): Promise<Product> {
    const product = new Product();

    Object.assign(product, {
      id: v4(),
      quantity_in_stock: data.quantityInStock,
      ...data,
    });

    this.products.push(product);

    return product;
  }

  public async findById(productId: string): Promise<Product | undefined> {
    return this.products.find(product => product.id === productId);
  }

  public async addPhotos(product: Product, photos: string[]): Promise<Product> {
    const productIndex = this.products.findIndex(
      item => item.id === product.id,
    );

    product.photos.push(...photos);

    this.products[productIndex] = product;

    return product;
  }

  public async addQuantityInStock(
    product: Product,
    quantity: number,
  ): Promise<Product> {
    const findProductIndex = this.products.findIndex(
      item => item.id === product.id,
    );

    Object.assign(product, {
      quantity_in_stock: product.quantity_in_stock + quantity,
    });

    this.products[findProductIndex] = product;

    return product;
  }

  public async removeQuantityFromStock(
    product: Product,
    quantity: number,
  ): Promise<Product> {
    const findProductIndex = this.products.findIndex(
      item => item.id === product.id,
    );

    Object.assign(product, {
      quantity_in_stock: product.quantity_in_stock - quantity,
    });

    this.products[findProductIndex] = product;

    return product;
  }

  public async edit(
    product: Product,
    data: Partial<IProductsRepositoryDTO>,
  ): Promise<Product> {
    const findProductIndex = this.products.findIndex(
      item => item.id === product.id,
    );

    Object.assign(product, {
      product_in_stock: data.quantityInStock,
      ...data,
    });

    this.products[findProductIndex] = product;

    return product;
  }

  public async deletePhotos(
    product: Product,
    photos: string[],
  ): Promise<Product> {
    const productIndex = this.products.findIndex(
      item => item.id === product.id,
    );

    photos.forEach(photo => {
      const findPhotoIndex = product.photos.findIndex(item => item === photo);

      product.photos.splice(findPhotoIndex, 1);
    });

    this.products[productIndex] = product;

    return product;
  }
}

import IProductsRepositoryDTO from '../dtos/IProductsRepositoryDTO';
import Product from '../infra/database/typeorm/entities/Product';

export default interface IProductsRepository {
  create(data: IProductsRepositoryDTO): Promise<Product>;
  findById(productId: string): Promise<Product | undefined>;
  removeQuantityFromStock(product: Product, quantity: number): Promise<Product>;
  addQuantityInStock(product: Product, quantity: number): Promise<Product>;
  edit(
    product: Product,
    data: Partial<IProductsRepositoryDTO>,
  ): Promise<Product>;
}

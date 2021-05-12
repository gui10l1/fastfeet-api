import IProductsRepositoryDTO from '../dtos/IProductsRepositoryDTO';
import Product from '../infra/database/typeorm/entities/Product';

export default interface IProductsRepository {
  create(data: IProductsRepositoryDTO): Promise<Product>;
  findById(productId: string): Promise<Product | undefined>;
}

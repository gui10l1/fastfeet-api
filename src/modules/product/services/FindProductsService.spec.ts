import AppError from '@shared/errors/AppError';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import FindProductsService from './FindProductsService';

let fakeProductsRepository: FakeProductsRepository;
let findProductsService: FindProductsService;

describe('FindProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    findProductsService = new FindProductsService(fakeProductsRepository);
  });

  it('should not be able to find a non-existing product', async () => {
    await expect(
      findProductsService.execute({
        productId: 'non-existing-product',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to find a specific product', async () => {
    const product = await fakeProductsRepository.create({
      description: 'Description',
      name: 'Product',
      photos: ['photoOne.png'],
      price: 500.0,
      quantityInStock: 123,
    });

    const findProduct = await findProductsService.execute({
      productId: product.id,
    });

    expect(findProduct.id).toBe(product.id);
  });
});

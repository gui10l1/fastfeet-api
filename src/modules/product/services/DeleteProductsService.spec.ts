import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import DeleteProductsService from './DeleteProductsService';

let fakeProductsRepository: FakeProductsRepository;
let fakeCacheProvider: FakeCacheProvider;
let deleteProductsService: DeleteProductsService;

describe('DeleteProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteProductsService = new DeleteProductsService(
      fakeProductsRepository,
      fakeCacheProvider,
    );
  });

  it('should not be able to delete a non-existing product', async () => {
    await expect(
      deleteProductsService.execute({
        productId: 'non-existing-product',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to delete products', async () => {
    const product = await fakeProductsRepository.create({
      description: 'Description',
      name: 'Product',
      photos: ['photoOne.png'],
      price: 500.0,
      quantityInStock: 123,
    });

    await deleteProductsService.execute({
      productId: product.id,
    });

    const findProduct = await fakeProductsRepository.findById(product.id);

    expect(findProduct).toBeUndefined();
  });
});

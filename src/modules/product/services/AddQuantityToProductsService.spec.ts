import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import AddQuantityToProductsService from './AddQuantityToProductsService';

let fakeProductsRepository: FakeProductsRepository;
let fakeCacheProvider: FakeCacheProvider;
let addQuantityToProductsService: AddQuantityToProductsService;

describe('AddQuantityToProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    addQuantityToProductsService = new AddQuantityToProductsService(
      fakeProductsRepository,
      fakeCacheProvider,
    );
  });

  it('should not be able to add quantity from a non-existing product', async () => {
    await expect(
      addQuantityToProductsService.execute({
        productId: 'product-id',
        quantityToBeAdded: 5,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to add negative values as quantity for a product', async () => {
    const product = await fakeProductsRepository.create({
      description: 'New product',
      name: 'Product',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 1696.35,
      quantityInStock: 0,
    });

    await expect(
      addQuantityToProductsService.execute({
        productId: product.id,
        quantityToBeAdded: -5,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to add quantity to a product', async () => {
    const product = await fakeProductsRepository.create({
      description: 'New product',
      name: 'Product',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 1696.35,
      quantityInStock: 5,
    });

    const updatedProduct = await addQuantityToProductsService.execute({
      productId: product.id,
      quantityToBeAdded: 6,
    });

    expect(updatedProduct.quantity_in_stock).toEqual(11);
  });
});

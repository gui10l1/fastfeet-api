import AppError from '@shared/errors/AppError';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import RemoveQuantityFromProductsService from './RemoveQuantityFromProductsService';

let fakeProductsRepository: FakeProductsRepository;
let removeQuantityFromProductsService: RemoveQuantityFromProductsService;

describe('RemoveQuantityFormProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    removeQuantityFromProductsService = new RemoveQuantityFromProductsService(
      fakeProductsRepository,
    );
  });

  it('should not be able to remove quantity from a non-existing product', async () => {
    await expect(
      removeQuantityFromProductsService.execute({
        productId: 'product-id',
        quantityToBeRemoved: 5,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to remove when product quantity is already zero', async () => {
    const product = await fakeProductsRepository.create({
      description: 'New product',
      name: 'Product',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 1572.99,
      quantityInStock: 0,
    });

    await expect(
      removeQuantityFromProductsService.execute({
        productId: product.id,
        quantityToBeRemoved: 5,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able for product quantity to be a negative number', async () => {
    const product = await fakeProductsRepository.create({
      description: 'New product',
      name: 'Product',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 1572.99,
      quantityInStock: 5,
    });

    const productUpdated = await removeQuantityFromProductsService.execute({
      productId: product.id,
      quantityToBeRemoved: 10,
    });

    expect(productUpdated.quantity_in_stock).toEqual(0);
  });

  it('should be able to remove quantity from a product', async () => {
    const product = await fakeProductsRepository.create({
      description: 'New product',
      name: 'Product',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 1572.99,
      quantityInStock: 5,
    });

    const productUpdated = await removeQuantityFromProductsService.execute({
      productId: product.id,
      quantityToBeRemoved: 5,
    });

    expect(productUpdated.quantity_in_stock).toEqual(0);
  });
});

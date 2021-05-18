import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/providers/StorageProvider/fakes/FakeStorageProvider';

import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import DeletePhotosFromProductsService from './RemovePhotosFromProductsService';

let fakeProductsRepository: FakeProductsRepository;
let fakeStorageProvider: FakeStorageProvider;
let deletePhotosToProductsService: DeletePhotosFromProductsService;

describe('RemovePhotosFromProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeStorageProvider = new FakeStorageProvider();
    deletePhotosToProductsService = new DeletePhotosFromProductsService(
      fakeProductsRepository,
      fakeStorageProvider,
    );
  });

  it('should not be able to remove photos of a non-existing product', async () => {
    await expect(
      deletePhotosToProductsService.execute({
        photos: ['newPhoto.png'],
        productId: 'non-existing-product',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to remove non-existing photos from a product', async () => {
    const product = await fakeProductsRepository.create({
      description: 'Description',
      name: 'Product',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 1895.85,
      quantityInStock: 10,
    });

    await expect(
      deletePhotosToProductsService.execute({
        productId: product.id,
        photos: ['photoThree.png'],
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to remove photos to a product', async () => {
    const product = await fakeProductsRepository.create({
      description: 'Description',
      name: 'Product',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 1895.85,
      quantityInStock: 10,
    });

    const updatedProduct = await deletePhotosToProductsService.execute({
      productId: product.id,
      photos: ['photoOne.png'],
    });

    expect(updatedProduct.photos).toEqual(['photoTwo.png']);
  });
});

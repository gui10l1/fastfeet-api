import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeStorageProvider from '@shared/providers/StorageProvider/fakes/FakeStorageProvider';

import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import AddPhotosToProductsService from './AddPhotosToProductsService';

let fakeProductsRepository: FakeProductsRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeCacheProvider: FakeCacheProvider;
let addPhotosToProductsService: AddPhotosToProductsService;

describe('AddPhotosToProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeCacheProvider = new FakeCacheProvider();
    addPhotosToProductsService = new AddPhotosToProductsService(
      fakeProductsRepository,
      fakeStorageProvider,
      fakeCacheProvider,
    );
  });

  it('should not be able to add photos of a non-existing product', async () => {
    await expect(
      addPhotosToProductsService.execute({
        photos: ['newPhoto.png'],
        productId: 'non-existing-product',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to add photos to a product', async () => {
    const product = await fakeProductsRepository.create({
      description: 'Description',
      name: 'Product',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 1895.85,
      quantityInStock: 10,
    });

    const updatedProduct = await addPhotosToProductsService.execute({
      productId: product.id,
      photos: ['photoThree.png', 'photoFour.png'],
    });

    expect(updatedProduct.photos).toEqual([
      'photoOne.png',
      'photoTwo.png',
      'photoThree.png',
      'photoFour.png',
    ]);
  });
});

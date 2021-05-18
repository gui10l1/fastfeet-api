import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/providers/StorageProvider/fakes/FakeStorageProvider';
import IProductsRepositoryDTO from '../dtos/IProductsRepositoryDTO';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import CreateProductsService from './CreateProductsService';

let createProductData: IProductsRepositoryDTO;
let fakeProductsRepository: FakeProductsRepository;
let fakeStorageProvider: FakeStorageProvider;
let createProductsService: CreateProductsService;

describe('CreateProducts', () => {
  beforeEach(() => {
    createProductData = {
      description: 'New product',
      name: 'Product',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 2375.85,
      quantityInStock: 75,
    };
    fakeStorageProvider = new FakeStorageProvider();
    fakeProductsRepository = new FakeProductsRepository();
    createProductsService = new CreateProductsService(
      fakeProductsRepository,
      fakeStorageProvider,
    );
  });

  it('should not be able to create a product with no products in stock', async () => {
    createProductData.quantityInStock = 0;

    await expect(
      createProductsService.execute({
        ...createProductData,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a product', async () => {
    const product = await createProductsService.execute({
      ...createProductData,
    });

    expect(product).toHaveProperty('id');
  });
});

import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import ListProductsService from './ListProductsService';

let fakeProductsRepository: FakeProductsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProductsService: ListProductsService;

describe('ListProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listProductsService = new ListProductsService(
      fakeProductsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all products', async () => {
    const productOne = await fakeProductsRepository.create({
      description: 'Product one description',
      name: 'Product one',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 789.85,
      quantityInStock: 100,
    });

    const productTwo = await fakeProductsRepository.create({
      description: 'Product two description',
      name: 'Product two',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 789.85,
      quantityInStock: 100,
    });

    const productThree = await fakeProductsRepository.create({
      description: 'Product three description',
      name: 'Product three',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 789.85,
      quantityInStock: 100,
    });

    const products = await listProductsService.execute();

    const parsedProducts = products.map(product => {
      return {
        id: product.id,
        description: product.description,
        name: product.name,
        photos: product.photos,
        price: product.price,
        quantity_in_stock: product.quantity_in_stock,
        quantityInStock: product.quantity_in_stock,
      };
    });

    expect(parsedProducts).toEqual([productOne, productTwo, productThree]);
  });

  it('should be able to list products from cache', async () => {
    const productOne = await fakeProductsRepository.create({
      description: 'Product one description',
      name: 'Product one',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 789.85,
      quantityInStock: 100,
    });

    await fakeProductsRepository.create({
      description: 'Product two description',
      name: 'Product two',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 789.85,
      quantityInStock: 100,
    });

    const productThree = await fakeProductsRepository.create({
      description: 'Product three description',
      name: 'Product three',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 789.85,
      quantityInStock: 100,
    });

    await fakeCacheProvider.save(
      'products-list',
      JSON.stringify([productOne, productThree]),
    );

    const products = await listProductsService.execute();

    expect(products).toEqual([productOne, productThree]);
  });
});

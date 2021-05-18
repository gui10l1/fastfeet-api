import AppError from '@shared/errors/AppError';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import UpdateProductsService from './UpdateProductsService';

let fakeProductsRepository: FakeProductsRepository;
let updateProductsService: UpdateProductsService;

describe('UpdateProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    updateProductsService = new UpdateProductsService(fakeProductsRepository);
  });

  it('should not be able to update a non-existing product', async () => {
    await expect(
      updateProductsService.execute({
        productId: 'non-existing-product',
        data: {
          description: 'New description to poduct',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update a product', async () => {
    const product = await fakeProductsRepository.create({
      description: 'Description',
      name: 'Product',
      photos: ['photoOne.png', 'photoTwo.png'],
      price: 1879.85,
      quantityInStock: 5,
    });

    const updatedProduct = await updateProductsService.execute({
      data: {
        description: 'New description',
        name: 'Updated product name',
        price: 500.85,
        quantityInStock: 6,
      },
      productId: product.id,
    });

    expect(updatedProduct.description).toBe('New description');
  });
});

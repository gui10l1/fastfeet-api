import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import AddQuantityToProductsService from './AddQuantityToProductsService';

let fakeProductsRepository: FakeProductsRepository;
let fakeUsersRepository: FakeUsersRepository;
let addQuantityToProductsService: AddQuantityToProductsService;

describe('AddQuantityToProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    addQuantityToProductsService = new AddQuantityToProductsService(
      fakeProductsRepository,
      fakeUsersRepository,
    );
  });

  it('should not be able to a non-existing user add quantity from products', async () => {
    await expect(
      addQuantityToProductsService.execute({
        productId: 'product-id',
        userId: 'non-existing-product',
        quantityToBeAdded: 5,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to a non-admin user add quantity from products', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      addQuantityToProductsService.execute({
        productId: 'product-id',
        userId: user.id,
        quantityToBeAdded: 5,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to add quantity from a non-existing product', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      deliveryMan: false,
    });

    await expect(
      addQuantityToProductsService.execute({
        productId: 'product-id',
        userId: user.id,
        quantityToBeAdded: 5,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to add negative values as quantity for a product', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      deliveryMan: false,
    });

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
        userId: user.id,
        quantityToBeAdded: -5,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to add quantity to a product', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      deliveryMan: false,
    });

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
      userId: user.id,
    });

    expect(updatedProduct.quantity_in_stock).toEqual(11);
  });
});

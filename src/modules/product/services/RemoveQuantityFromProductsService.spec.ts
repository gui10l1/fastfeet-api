import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import RemoveQuantityFromProductsService from './RemoveQuantityFromProductsService';

let fakeProductsRepository: FakeProductsRepository;
let fakeUsersRepository: FakeUsersRepository;
let removeQuantityFromProductsService: RemoveQuantityFromProductsService;

describe('RemoveQuantityFormProducts', () => {
  beforeEach(() => {
    fakeProductsRepository = new FakeProductsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    removeQuantityFromProductsService = new RemoveQuantityFromProductsService(
      fakeProductsRepository,
      fakeUsersRepository,
    );
  });

  it('should not be able to a non-existing user remove quantity from products', async () => {
    await expect(
      removeQuantityFromProductsService.execute({
        productId: 'product-id',
        userId: 'non-existing-product',
        quantityToBeRemoved: 5,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to a non-admin user remove quantity from products', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      removeQuantityFromProductsService.execute({
        productId: 'product-id',
        userId: user.id,
        quantityToBeRemoved: 5,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to remove quantity from a non-existing product', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      deliveryMan: false,
    });

    await expect(
      removeQuantityFromProductsService.execute({
        productId: 'product-id',
        userId: user.id,
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

    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      deliveryMan: false,
    });

    await expect(
      removeQuantityFromProductsService.execute({
        productId: product.id,
        userId: user.id,
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

    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      deliveryMan: false,
    });

    const productUpdated = await removeQuantityFromProductsService.execute({
      productId: product.id,
      userId: user.id,
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

    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      deliveryMan: false,
    });

    const productUpdated = await removeQuantityFromProductsService.execute({
      productId: product.id,
      userId: user.id,
      quantityToBeRemoved: 5,
    });

    expect(productUpdated.quantity_in_stock).toEqual(0);
  });
});

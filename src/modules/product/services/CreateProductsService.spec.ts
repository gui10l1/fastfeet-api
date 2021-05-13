import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import IProductsRepositoryDTO from '../dtos/IProductsRepositoryDTO';
import FakeProductsRepository from '../repositories/fakes/FakeProductsRepository';
import CreateProductsService from './CreateProductsService';

let createProductData: IProductsRepositoryDTO;
let fakeProductsRepository: FakeProductsRepository;
let fakeUsersRepository: FakeUsersRepository;
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
    fakeProductsRepository = new FakeProductsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    createProductsService = new CreateProductsService(
      fakeProductsRepository,
      fakeUsersRepository,
    );
  });

  it('should not be able to create a product from a non-existing admin', async () => {
    await expect(
      createProductsService.execute({
        userId: 'non-existing-user',
        data: createProductData,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to a delivery man create a product', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '0000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      createProductsService.execute({
        userId: user.id,
        data: createProductData,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a product with no products in stock', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '0000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      deliveryMan: false,
    });

    createProductData.quantityInStock = 0;

    await expect(
      createProductsService.execute({
        userId: user.id,
        data: createProductData,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a product', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '0000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      deliveryMan: false,
    });

    const product = await createProductsService.execute({
      userId: user.id,
      data: createProductData,
    });

    expect(product).toHaveProperty('id');
  });
});

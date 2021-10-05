import FakeClientsRepository from '@modules/client/repositories/fakes/FakeClientsRepository';
import FakeProductsRepository from '@modules/product/repositories/fakes/FakeProductsRepository';

import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import FakeSocketProvider from '@shared/providers/SocketProvider/fakes/FakeSocketProvider';

import IDeliveriesRepositoryDTO from '../../dtos/IDeliveriesRepositoryDTO';
import FakeDeliveriesRepository from '../../repositories/fakes/FakeDeliveriesRepository';
import CreateDeliveriesService from './CreateDeliveriesService';

let deliveryDataToCreate: IDeliveriesRepositoryDTO;
let fakeDeliveriesRepository: FakeDeliveriesRepository;
let fakeProductsRepository: FakeProductsRepository;
let fakeClientsRepository: FakeClientsRepository;
let fakeMailProvider: FakeMailProvider;
let createDeliveriesService: CreateDeliveriesService;
let fakeCacheProvider: FakeCacheProvider;
let fakeSocketProvider: FakeSocketProvider;

describe('CreateDeliveries', () => {
  beforeEach(() => {
    deliveryDataToCreate = {
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'Product to be delivered',
      recipientId: '',
      state: 'Fake state',
      productQuantity: 1,
    };
    fakeDeliveriesRepository = new FakeDeliveriesRepository();
    fakeClientsRepository = new FakeClientsRepository();
    fakeProductsRepository = new FakeProductsRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeCacheProvider = new FakeCacheProvider();
    fakeSocketProvider = new FakeSocketProvider();
    createDeliveriesService = new CreateDeliveriesService(
      fakeDeliveriesRepository,
      fakeClientsRepository,
      fakeProductsRepository,
      fakeMailProvider,
      fakeCacheProvider,
      fakeSocketProvider,
    );
  });

  it('should not be able to create a delivery from a non-existing client', async () => {
    await expect(
      createDeliveriesService.execute(deliveryDataToCreate),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to request a delivery of a non-existing product', async () => {
    const client = await fakeClientsRepository.create({
      email: 'janedoe@exemple.com',
      name: 'Jane Doe',
      password: '123456',
    });

    deliveryDataToCreate.recipientId = client.id;

    await expect(
      createDeliveriesService.execute(deliveryDataToCreate),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a delivery when the requested quantity is greater than the product quantity in stock', async () => {
    const client = await fakeClientsRepository.create({
      email: 'janedoe@exemple.com',
      name: 'Jane Doe',
      password: '123456',
    });

    const product = await fakeProductsRepository.create({
      description: 'Description',
      name: 'Product',
      photos: ['photoOne.png', 'photoTwo,png'],
      price: 1857.23,
      quantityInStock: 5,
    });

    deliveryDataToCreate.recipientId = client.id;
    deliveryDataToCreate.productId = product.id;
    deliveryDataToCreate.productQuantity = 6;

    await expect(
      createDeliveriesService.execute(deliveryDataToCreate),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a new delivery', async () => {
    const client = await fakeClientsRepository.create({
      email: 'janedoe@exemple.com',
      name: 'Jane Doe',
      password: '123456',
    });

    const product = await fakeProductsRepository.create({
      description: 'Description',
      name: 'Product',
      photos: ['photoOne.png', 'photoTwo,png'],
      price: 1857.23,
      quantityInStock: 100,
    });

    deliveryDataToCreate.recipientId = client.id;
    deliveryDataToCreate.productId = product.id;
    deliveryDataToCreate.productQuantity = 10;

    const delivery = await createDeliveriesService.execute(
      deliveryDataToCreate,
    );

    expect(delivery).toHaveProperty('id');
    expect(delivery.recipient_id).toBe(client.id);
  });

  it('should be able to send a email to client when the delivery is created', async () => {
    const spyOnMailMethod = jest.spyOn(fakeMailProvider, 'sendMail');

    const product = await fakeProductsRepository.create({
      description: 'Description',
      name: 'Product',
      photos: ['photoOne.png', 'photoTwo,png'],
      price: 1857.23,
      quantityInStock: 100,
    });

    const client = await fakeClientsRepository.create({
      email: 'janedoe@exemple.com',
      name: 'Jane Doe',
      password: '123456',
    });

    deliveryDataToCreate.recipientId = client.id;
    deliveryDataToCreate.productId = product.id;
    deliveryDataToCreate.productQuantity = 100;

    await createDeliveriesService.execute(deliveryDataToCreate);

    expect(spyOnMailMethod).toHaveBeenCalled();
  });

  it('should be able to remove quantity from product after create a delivery', async () => {
    const spyOnProductsRepositoryMethod = jest.spyOn(
      fakeProductsRepository,
      'removeQuantityFromStock',
    );

    const client = await fakeClientsRepository.create({
      email: 'janedoe@exemple.com',
      name: 'Jane Doe',
      password: '123456',
    });

    const product = await fakeProductsRepository.create({
      description: 'Description',
      name: 'Product',
      photos: ['photoOne.png', 'photoTwo,png'],
      price: 1857.23,
      quantityInStock: 100,
    });

    deliveryDataToCreate.recipientId = client.id;
    deliveryDataToCreate.productId = product.id;
    deliveryDataToCreate.productQuantity = 10;

    await createDeliveriesService.execute(deliveryDataToCreate);

    expect(spyOnProductsRepositoryMethod).toHaveBeenCalledWith(product, 10);
  });
});

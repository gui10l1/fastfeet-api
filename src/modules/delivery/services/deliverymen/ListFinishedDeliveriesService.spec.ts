import FakeDeliveriesRepository from '@modules/delivery/repositories/fakes/FakeDeliveriesRepository';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import ListFinishedDeliveriesService from './ListFinishedDeliveriesService';

let fakeUsersRepository: FakeUsersRepository;
let fakeDeliveriesRepository: FakeDeliveriesRepository;
let fakeCacheProvider: FakeCacheProvider;
let listFinishedDeliveriesService: ListFinishedDeliveriesService;

describe('ListFinishedDeliveries', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeDeliveriesRepository = new FakeDeliveriesRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listFinishedDeliveriesService = new ListFinishedDeliveriesService(
      fakeDeliveriesRepository,
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should not be able to list deliveries from a non-existing delivery man', async () => {
    await expect(
      listFinishedDeliveriesService.execute({
        deliveryManId: 'non-existing-delivery-man',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to list deliveries from a admin user', async () => {
    const admin = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      deliveryMan: false,
    });

    await expect(
      listFinishedDeliveriesService.execute({
        deliveryManId: admin.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to list only finished deliveries from a specific delivery man', async () => {
    const deliveryMan = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const deliveryOne = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'product_id',
      recipientId: 'recipient',
      state: 'Fake state',
      productQuantity: 5,
    });

    const deliveryTwo = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'product_id',
      recipientId: 'recipient_id',
      state: 'Fake state',
      productQuantity: 5,
    });

    await fakeDeliveriesRepository.acceptDelivery(deliveryOne, deliveryMan.id);
    await fakeDeliveriesRepository.acceptDelivery(deliveryTwo, deliveryMan.id);

    await fakeDeliveriesRepository.finishDelivery(
      deliveryOne,
      new Date(),
      'signaturePhoto.png',
    );

    const finishedDeliveries = await listFinishedDeliveriesService.execute({
      deliveryManId: deliveryMan.id,
    });

    expect(finishedDeliveries).toEqual([deliveryOne]);
  });

  it('should be able to list finished deliveries from cache', async () => {
    const deliveryMan = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const deliveryOne = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'product_id',
      recipientId: 'recipient',
      state: 'Fake state',
      productQuantity: 5,
    });

    const deliveryTwo = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'product_id',
      recipientId: 'recipient_id',
      state: 'Fake state',
      productQuantity: 5,
    });

    await fakeDeliveriesRepository.acceptDelivery(deliveryOne, deliveryMan.id);
    await fakeDeliveriesRepository.acceptDelivery(deliveryTwo, deliveryMan.id);

    await fakeDeliveriesRepository.finishDelivery(
      deliveryOne,
      new Date(),
      'signaturePhoto.png',
    );

    await fakeCacheProvider.save(
      `delivery-man:${deliveryMan.id}:finished-deliveries`,
      JSON.stringify([deliveryOne]),
    );

    const finishedDeliveries = await listFinishedDeliveriesService.execute({
      deliveryManId: deliveryMan.id,
    });

    expect(JSON.stringify(finishedDeliveries)).toBe(
      JSON.stringify([deliveryOne]),
    );
  });
});

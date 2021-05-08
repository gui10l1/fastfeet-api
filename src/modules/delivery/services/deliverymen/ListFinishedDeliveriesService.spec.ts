import FakeDeliveriesRepository from '@modules/delivery/repositories/fakes/FakeDeliveriesRepository';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import ListFinishedDeliveriesService from './ListFinishedDeliveriesService';

let fakeUsersRepository: FakeUsersRepository;
let fakeDeliveriesRepository: FakeDeliveriesRepository;
let listFinishedDeliveriesService: ListFinishedDeliveriesService;

describe('ListFinishedDeliveries', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeDeliveriesRepository = new FakeDeliveriesRepository();
    listFinishedDeliveriesService = new ListFinishedDeliveriesService(
      fakeDeliveriesRepository,
      fakeUsersRepository,
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
      product: 'Product to be delivered',
      recipientId: 'recipient',
      state: 'Fake state',
    });

    const deliveryTwo = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      product: 'Product to be delivered',
      recipientId: 'recipient_id',
      state: 'Fake state',
    });

    await fakeDeliveriesRepository.acceptDelivery(deliveryOne, deliveryMan.id);
    await fakeDeliveriesRepository.acceptDelivery(deliveryTwo, deliveryMan.id);

    await fakeDeliveriesRepository.finishDelivery(deliveryOne, new Date());

    const finishedDeliveries = await listFinishedDeliveriesService.execute({
      deliveryManId: deliveryMan.id,
    });

    expect(finishedDeliveries).toEqual([deliveryOne]);
  });
});

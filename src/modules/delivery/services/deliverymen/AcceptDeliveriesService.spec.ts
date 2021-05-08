import FakeDeliveriesRepository from '@modules/delivery/repositories/fakes/FakeDeliveriesRepository';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import AcceptDeliveriesService from './AcceptDeliveriesService';

let fakeDeliveriesRepository: FakeDeliveriesRepository;
let fakeUsersRepository: FakeUsersRepository;
let acceptDeliveriesService: AcceptDeliveriesService;

describe('AcceptDeliveries', () => {
  beforeEach(() => {
    fakeDeliveriesRepository = new FakeDeliveriesRepository();
    fakeUsersRepository = new FakeUsersRepository();
    acceptDeliveriesService = new AcceptDeliveriesService(
      fakeDeliveriesRepository,
      fakeUsersRepository,
    );
  });

  it('should not be able to a non-existing delivery man accept a delivery', async () => {
    const delivery = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      product: 'Product to be delivered',
      recipientId: 'recipient_id',
      state: 'Fake state',
    });

    await expect(
      acceptDeliveriesService.execute({
        deliveryId: delivery.id,
        deliveryManId: 'non-existing-delivery-man',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to a admin accept a delivery', async () => {
    const admin = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      deliveryMan: false,
    });

    const delivery = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      product: 'Product to be delivered',
      recipientId: 'recipient_id',
      state: 'Fake state',
    });

    await expect(
      acceptDeliveriesService.execute({
        deliveryId: delivery.id,
        deliveryManId: admin.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to a delivery man accept a non-existing delivery', async () => {
    const deliveryMan = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      acceptDeliveriesService.execute({
        deliveryId: 'non-existing-delivery',
        deliveryManId: deliveryMan.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to accept a delivery that has already been accepted', async () => {
    const deliveryMan = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const delivery = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      product: 'Product to be delivered',
      recipientId: 'recipient_id',
      state: 'Fake state',
    });

    await fakeDeliveriesRepository.acceptDelivery(delivery, 'delivery-man-id');

    await expect(
      acceptDeliveriesService.execute({
        deliveryId: delivery.id,
        deliveryManId: deliveryMan.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to accept a delivery', async () => {
    const spyOnDeliveriesRepositoryMethod = jest.spyOn(
      fakeDeliveriesRepository,
      'acceptDelivery',
    );

    const deliveryMan = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const delivery = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      product: 'Product to be delivered',
      recipientId: 'recipient_id',
      state: 'Fake state',
    });

    await acceptDeliveriesService.execute({
      deliveryId: delivery.id,
      deliveryManId: deliveryMan.id,
    });

    const findDelivery = await fakeDeliveriesRepository.findById(delivery.id);

    if (findDelivery) {
      expect(findDelivery.deliveryman_id).toBe(deliveryMan.id);
    }

    expect(spyOnDeliveriesRepositoryMethod).toHaveBeenCalled();
  });
});

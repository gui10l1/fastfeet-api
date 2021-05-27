import FakeDeliveriesRepository from '@modules/delivery/repositories/fakes/FakeDeliveriesRepository';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import WithdrawDeliveriesService from './WithdrawDeliveriesService';

let fakeDeliveriesRepository: FakeDeliveriesRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let withdrawDeliveriesService: WithdrawDeliveriesService;

describe('WithdrawDeliveries', () => {
  beforeEach(() => {
    fakeDeliveriesRepository = new FakeDeliveriesRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    withdrawDeliveriesService = new WithdrawDeliveriesService(
      fakeDeliveriesRepository,
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should not be able to withdraw a delivery that not exisits', async () => {
    const deliveryMan = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      withdrawDeliveriesService.execute({
        deliveryId: 'non-existing-delivery',
        deliveryManId: deliveryMan.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to a non-existing delivery man withdraw a delivery', async () => {
    const delivery = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'product_id',
      recipientId: 'recipient_id',
      state: 'Fake state',
      productQuantity: 5,
    });

    await expect(
      withdrawDeliveriesService.execute({
        deliveryId: delivery.id,
        deliveryManId: 'non-existing-delivery-man',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to withdraw a delivery that has not been accepted by the delivery man himself', async () => {
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
      productId: 'product_id',
      recipientId: 'recipient_id',
      state: 'Fake state',
      productQuantity: 5,
    });

    await expect(
      withdrawDeliveriesService.execute({
        deliveryId: delivery.id,
        deliveryManId: deliveryMan.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to withdraw deliveries between 8am and 12pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 7, 13, 0, 0).getHours();
    });

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
      productId: 'product_id',
      recipientId: 'recipient_id',
      state: 'Fake state',
      productQuantity: 5,
    });

    await fakeDeliveriesRepository.acceptDelivery(delivery, deliveryMan.id);

    await expect(
      withdrawDeliveriesService.execute({
        deliveryId: delivery.id,
        deliveryManId: deliveryMan.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to withdraw a delivery', async () => {
    const spyOnDeliveriesRepositoryMethod = jest.spyOn(
      fakeDeliveriesRepository,
      'withdrawDelivery',
    );

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 7, 9, 0, 0).getTime();
    });

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
      productId: 'Product to be delivered',
      recipientId: 'recipient_id',
      state: 'Fake state',
      productQuantity: 5,
    });

    await fakeDeliveriesRepository.acceptDelivery(delivery, deliveryMan.id);

    await withdrawDeliveriesService.execute({
      deliveryId: delivery.id,
      deliveryManId: deliveryMan.id,
    });

    const findDelivery = await fakeDeliveriesRepository.findById(delivery.id);

    if (findDelivery) {
      expect(findDelivery.start_date).toEqual(new Date(2021, 4, 7, 9, 0, 0));
    }

    expect(spyOnDeliveriesRepositoryMethod).toHaveBeenCalled();
  });
});

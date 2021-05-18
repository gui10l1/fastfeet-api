import IDeliveriesRepositoryDTO from '@modules/delivery/dtos/IDeliveriesRepositoryDTO';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeDeliveriesRepository from '../../repositories/fakes/FakeDeliveriesRepository';
import ListDeliveriesService from './ListDeliveriesService';

let deliveryDataToCreate: IDeliveriesRepositoryDTO;
let fakeDeliveriesRepository: FakeDeliveriesRepository;
let fakeUsersRepository: FakeUsersRepository;
let listDeliveriesService: ListDeliveriesService;

describe('ListDeliveries', () => {
  beforeEach(() => {
    deliveryDataToCreate = {
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      product: 'Product to be delivered',
      recipientId: '',
      state: 'Fake state',
    };
    fakeDeliveriesRepository = new FakeDeliveriesRepository();
    fakeUsersRepository = new FakeUsersRepository();
    listDeliveriesService = new ListDeliveriesService(
      fakeDeliveriesRepository,
      fakeUsersRepository,
    );
  });

  it('should not be able to list deliveries from a non-existing delivery man', async () => {
    await expect(
      listDeliveriesService.execute({
        deliveryManId: 'non-existing-delivery-man-id',
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
      listDeliveriesService.execute({
        deliveryManId: admin.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to list delivery man's deliveries", async () => {
    const deliveryMan = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const deliveryOne = await fakeDeliveriesRepository.create(
      deliveryDataToCreate,
    );

    const deliveryTwo = await fakeDeliveriesRepository.create(
      deliveryDataToCreate,
    );

    const deliveryThree = await fakeDeliveriesRepository.create(
      deliveryDataToCreate,
    );

    await fakeDeliveriesRepository.create(deliveryDataToCreate);

    await fakeDeliveriesRepository.acceptDelivery(deliveryOne, deliveryMan.id);
    await fakeDeliveriesRepository.acceptDelivery(deliveryTwo, deliveryMan.id);
    await fakeDeliveriesRepository.acceptDelivery(
      deliveryThree,
      deliveryMan.id,
    );

    await fakeDeliveriesRepository.cancelDelivery(deliveryThree, new Date());

    await fakeDeliveriesRepository.finishDelivery(
      deliveryTwo,
      new Date(),
      'signatureId',
    );

    const deliveriesFromDeliveryMan = await listDeliveriesService.execute({
      deliveryManId: deliveryMan.id,
    });

    expect(deliveriesFromDeliveryMan).toEqual([deliveryOne]);
  });
});

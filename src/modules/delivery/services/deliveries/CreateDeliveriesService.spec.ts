import FakeClientsRepository from '@modules/client/repositories/fakes/FakeClientsRepository';
import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';

import IDeliveriesRepositoryDTO from '../../dtos/IDeliveriesRepositoryDTO';
import FakeDeliveriesRepository from '../../repositories/fakes/FakeDeliveriesRepository';
import CreateDeliveriesService from './CreateDeliveriesService';

let deliveryDataToCreate: IDeliveriesRepositoryDTO;
let fakeDeliveriesRepository: FakeDeliveriesRepository;
let fakeClientsRepository: FakeClientsRepository;
let fakeMailProvider: FakeMailProvider;
let createDeliveriesService: CreateDeliveriesService;

describe('CreateDeliveries', () => {
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
    fakeClientsRepository = new FakeClientsRepository();
    fakeMailProvider = new FakeMailProvider();
    createDeliveriesService = new CreateDeliveriesService(
      fakeDeliveriesRepository,
      fakeClientsRepository,
      fakeMailProvider,
    );
  });

  it('should not be able to create a delivery from a non-existing client', async () => {
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

    deliveryDataToCreate.recipientId = client.id;

    const delivery = await createDeliveriesService.execute(
      deliveryDataToCreate,
    );

    expect(delivery).toHaveProperty('id');
    expect(delivery.recipient_id).toBe(client.id);
  });

  it('should be able to send a email to client when the delivery is created', async () => {
    const spyOnMailMethod = jest.spyOn(fakeMailProvider, 'sendMail');

    const client = await fakeClientsRepository.create({
      email: 'janedoe@exemple.com',
      name: 'Jane Doe',
      password: '123456',
    });

    deliveryDataToCreate.recipientId = client.id;

    await createDeliveriesService.execute(deliveryDataToCreate);

    expect(spyOnMailMethod).toHaveBeenCalled();
  });
});

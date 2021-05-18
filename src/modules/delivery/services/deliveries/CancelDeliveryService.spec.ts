import FakeClientsRepository from '@modules/client/repositories/fakes/FakeClientsRepository';
import FakeDeliveriesRepository from '@modules/delivery/repositories/fakes/FakeDeliveriesRepository';
import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import CancelDeliveriesService from './CancelDeliveryService';

let fakeDeliveriesRepository: FakeDeliveriesRepository;
let fakeClientsRepository: FakeClientsRepository;
let fakeMailProvider: FakeMailProvider;
let cancelDeliveriesService: CancelDeliveriesService;

describe('CancelDeliveries', () => {
  beforeEach(() => {
    fakeDeliveriesRepository = new FakeDeliveriesRepository();
    fakeClientsRepository = new FakeClientsRepository();
    fakeMailProvider = new FakeMailProvider();
    cancelDeliveriesService = new CancelDeliveriesService(
      fakeDeliveriesRepository,
      fakeClientsRepository,
      fakeMailProvider,
    );
  });

  it('should not be able to cancel delivery from a non-existing client', async () => {
    const delivery = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'product_id',
      recipientId: '',
      state: 'Fake state',
      productQuantity: 5,
    });

    await expect(
      cancelDeliveriesService.execute({
        deliveryId: delivery.id,
        clientId: 'non-existing-client',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to cancel a non-existing delivery', async () => {
    const client = await fakeClientsRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      cancelDeliveriesService.execute({
        deliveryId: 'non-existing-delivery',
        clientId: client.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to cancel another client's delivery", async () => {
    const client = await fakeClientsRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const clientToDoCancelation = await fakeClientsRepository.create({
      email: 'johntre@exemple.com',
      name: 'John Tre',
      password: '123456',
    });

    const delivery = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'product_id',
      state: 'Fake state',
      productQuantity: 5,
      recipientId: client.id,
    });

    await expect(
      cancelDeliveriesService.execute({
        clientId: clientToDoCancelation.id,
        deliveryId: delivery.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to send a email to client warning about the cancelation', async () => {
    const spyOnMailMethod = jest.spyOn(fakeMailProvider, 'sendMail');

    const client = await fakeClientsRepository.create({
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
      state: 'Fake state',
      productQuantity: 5,
      recipientId: client.id,
    });

    await cancelDeliveriesService.execute({
      deliveryId: delivery.id,
      clientId: client.id,
    });

    expect(spyOnMailMethod).toHaveBeenCalled();
  });

  it('should able to cancel a delivery', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 10, 30, 0).getTime();
    });

    const client = await fakeClientsRepository.create({
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
      state: 'Fake state',
      productQuantity: 5,
      recipientId: client.id,
    });

    await cancelDeliveriesService.execute({
      clientId: client.id,
      deliveryId: delivery.id,
    });

    const findCanceledDelivery = await fakeDeliveriesRepository.findById(
      delivery.id,
    );

    if (findCanceledDelivery) {
      expect(findCanceledDelivery.canceled_at).toEqual(
        new Date(2021, 4, 10, 10, 30, 0),
      );
    }
  });
});

import FakeClientsRepository from '@modules/client/repositories/fakes/FakeClientsRepository';
import FakeDeliveriesRepository from '@modules/delivery/repositories/fakes/FakeDeliveriesRepository';
import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import FakeStorageProvider from '@shared/providers/StorageProvider/fakes/FakeStorageProvider';

import FinishDeliveriesService from './FinishDeliveriesService';

let fakeDeliveriesRepository: FakeDeliveriesRepository;
let fakeClientsRepository: FakeClientsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeStorageProvider: FakeStorageProvider;
let finishDeliveriesService: FinishDeliveriesService;

describe('FinishDeliveries', () => {
  beforeEach(() => {
    fakeDeliveriesRepository = new FakeDeliveriesRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakeClientsRepository = new FakeClientsRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeStorageProvider = new FakeStorageProvider();
    finishDeliveriesService = new FinishDeliveriesService(
      fakeDeliveriesRepository,
      fakeClientsRepository,
      fakeUsersRepository,
      fakeMailProvider,
      fakeStorageProvider,
    );
  });

  it('should not be able to finish a non-existing delivery', async () => {
    const deliveryMan = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      finishDeliveriesService.execute({
        deliveryId: 'non-existing-delivery',
        deliveryManId: deliveryMan.id,
        signaturePhotoFile: 'signaturePhoto.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to finish a delivery from a non-existing man', async () => {
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
      finishDeliveriesService.execute({
        deliveryId: delivery.id,
        deliveryManId: 'non-existing-delivery-man',
        signaturePhotoFile: '.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to finish deliveries that does not belong to delivery man', async () => {
    const deliveryManOne = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const deliveryManTwo = await fakeUsersRepository.create({
      cpf: '11111111111',
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
      recipientId: 'recipient_id',
      state: 'Fake state',
      productQuantity: 5,
    });

    await fakeDeliveriesRepository.acceptDelivery(delivery, deliveryManTwo.id);
    await fakeDeliveriesRepository.withdrawDelivery(delivery, new Date());

    await expect(
      finishDeliveriesService.execute({
        deliveryId: delivery.id,
        deliveryManId: deliveryManOne.id,
        signaturePhotoFile: 'signaturePhoto.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to finish a delivery that has not been withdrawn', async () => {
    const deliveryMan = await fakeUsersRepository.create({
      cpf: '11111111111',
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
      recipientId: 'recipient_id',
      state: 'Fake state',
      productQuantity: 5,
    });

    await fakeDeliveriesRepository.acceptDelivery(delivery, deliveryMan.id);

    await expect(
      finishDeliveriesService.execute({
        deliveryId: delivery.id,
        deliveryManId: deliveryMan.id,
        signaturePhotoFile: 'signaturePhoto.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to finish a delivery without recipient', async () => {
    const deliveryMan = await fakeUsersRepository.create({
      cpf: '11111111111',
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
      recipientId: 'recipient_id',
      state: 'Fake state',
      productQuantity: 5,
    });

    await fakeDeliveriesRepository.acceptDelivery(delivery, deliveryMan.id);

    await fakeDeliveriesRepository.withdrawDelivery(delivery, new Date());

    await expect(
      finishDeliveriesService.execute({
        deliveryId: delivery.id,
        deliveryManId: deliveryMan.id,
        signaturePhotoFile: 'signaturePhoto.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to finish a delivery that has already been finished', async () => {
    const client = await fakeClientsRepository.create({
      email: 'janedoe@exemple.com',
      name: 'Jena Doe',
      password: '123456',
    });

    const deliveryMan = await fakeUsersRepository.create({
      cpf: '11111111111',
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
      recipientId: client.id,
      state: 'Fake state',
      productQuantity: 5,
    });

    await fakeDeliveriesRepository.acceptDelivery(delivery, deliveryMan.id);
    await fakeDeliveriesRepository.withdrawDelivery(delivery, new Date());
    await fakeDeliveriesRepository.finishDelivery(
      delivery,
      new Date(),
      'signaturePhoto.png',
    );

    await expect(
      finishDeliveriesService.execute({
        deliveryId: delivery.id,
        deliveryManId: deliveryMan.id,
        signaturePhotoFile: 'signaturePhoto.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to finish a delivery', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 4, 10, 10, 30, 0).getTime();
    });

    const client = await fakeClientsRepository.create({
      email: 'janedoe@exemple.com',
      name: 'Jena Doe',
      password: '123456',
    });

    const deliveryMan = await fakeUsersRepository.create({
      cpf: '11111111111',
      email: 'johntre@exemple.com',
      name: 'John Tre',
      password: '123456',
    });

    const delivery = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'Product to be delivered',
      productQuantity: 5,
      state: 'Fake state',
      recipientId: client.id,
    });

    await fakeDeliveriesRepository.acceptDelivery(delivery, deliveryMan.id);

    await fakeDeliveriesRepository.withdrawDelivery(delivery, new Date());

    await finishDeliveriesService.execute({
      deliveryId: delivery.id,
      deliveryManId: deliveryMan.id,
      signaturePhotoFile: 'signaturePhoto.png',
    });

    const findDelivery = await fakeDeliveriesRepository.findById(delivery.id);

    if (findDelivery) {
      expect(findDelivery.end_date).toEqual(new Date(2021, 4, 10, 10, 30, 0));
      expect(findDelivery.signature_id).toBe('signaturePhoto.png');
    }
  });
});

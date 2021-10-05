import FakeDeliveriesRepository from '@modules/delivery/repositories/fakes/FakeDeliveriesRepository';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';

import ListDeliveriesService from './ListDeliveriesService';

let fakeCacheProvider: FakeCacheProvider;
let fakeDeliveriesRepository: FakeDeliveriesRepository;
let listDeliveriesService: ListDeliveriesService;

describe('ListDeliveries', () => {
  beforeEach(() => {
    fakeCacheProvider = new FakeCacheProvider();
    fakeDeliveriesRepository = new FakeDeliveriesRepository();
    listDeliveriesService = new ListDeliveriesService(
      fakeDeliveriesRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list all deliveries created', async () => {
    await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'Product to be delivered',
      recipientId: '',
      state: 'Fake state',
      productQuantity: 1,
    });

    await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'Product to be delivered',
      recipientId: '',
      state: 'Fake state',
      productQuantity: 1,
    });

    await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'Product to be delivered',
      recipientId: '',
      state: 'Fake state',
      productQuantity: 1,
    });

    const deliveries = await listDeliveriesService.execute();

    expect(deliveries).toBeInstanceOf(Array);
  });

  it('should be able to list all deliveries from cache', async () => {
    const deliveryOne = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'Product to be delivered',
      recipientId: '',
      state: 'Fake state',
      productQuantity: 1,
    });

    const deliveryTwo = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'Product to be delivered',
      recipientId: '',
      state: 'Fake state',
      productQuantity: 1,
    });

    const deliveryThree = await fakeDeliveriesRepository.create({
      address: 'Fake address',
      city: 'Fake city',
      neighborhood: 'Fake neighborhood',
      postalCode: 'Postal code',
      productId: 'Product to be delivered',
      recipientId: '',
      state: 'Fake state',
      productQuantity: 1,
    });

    await fakeCacheProvider.save(
      'deliveries-list',
      JSON.stringify([deliveryOne, deliveryTwo, deliveryThree]),
    );

    const deliveries = await listDeliveriesService.execute();

    expect(deliveries).toEqual([deliveryOne, deliveryTwo, deliveryThree]);
  });
});

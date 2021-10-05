import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeClientsRepository from '../../repositories/fakes/FakeClientsRepository';
import ListClientsService from './ListClientsService';

let fakeClientsRepository: FakeClientsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listClientsService: ListClientsService;

describe('ListClients', () => {
  beforeEach(() => {
    fakeClientsRepository = new FakeClientsRepository();
    fakeCacheProvider = new FakeCacheProvider();
    listClientsService = new ListClientsService(
      fakeClientsRepository,
      fakeCacheProvider,
    );
  });

  it('should be able to list clients', async () => {
    await fakeClientsRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      postalCode: '00000000',
    });

    await fakeClientsRepository.create({
      email: 'jennadoe@exemple.com',
      name: 'Jenna Doe',
      password: '123456',
      postalCode: '00000000',
    });

    const clients = await listClientsService.execute();

    expect(clients).toBeInstanceOf(Array);
  });

  it('should be able to list clients from cache', async () => {
    const deliveryOne = await fakeClientsRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      postalCode: '00000000',
    });

    const deliveryTwo = await fakeClientsRepository.create({
      email: 'jennadoe@exemple.com',
      name: 'Jenna Doe',
      password: '123456',
      postalCode: '00000000',
    });

    await fakeCacheProvider.save(
      'clients-list',
      JSON.stringify([deliveryOne, deliveryTwo]),
    );

    const clients = await listClientsService.execute();

    expect(clients).toEqual([deliveryOne, deliveryTwo]);
  });
});

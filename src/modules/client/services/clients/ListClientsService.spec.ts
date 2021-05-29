import FakeClientsRepository from '../../repositories/fakes/FakeClientsRepository';
import ListClientsService from './ListClientsService';

let fakeClientsRepository: FakeClientsRepository;
let listClientsService: ListClientsService;

describe('ListClients', () => {
  beforeEach(() => {
    fakeClientsRepository = new FakeClientsRepository();
    listClientsService = new ListClientsService(fakeClientsRepository);
  });

  it('should be able to list clients', async () => {
    const clientOne = await fakeClientsRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      postalCode: '00000000',
    });

    const clientTwo = await fakeClientsRepository.create({
      email: 'jennadoe@exemple.com',
      name: 'Jenna Doe',
      password: '123456',
      postalCode: '00000000',
    });

    const clients = await listClientsService.execute();

    expect(clients).toEqual([clientOne, clientTwo]);
  });
});

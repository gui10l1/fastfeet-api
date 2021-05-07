import AppError from '@shared/errors/AppError';
import FakeClientsRepository from '../../repositories/fakes/FakeClientsRepository';
import FindClientsService from './FindClientsService';

let fakeClientsRepository: FakeClientsRepository;
let findClientsService: FindClientsService;

describe('FindClients', () => {
  beforeEach(() => {
    fakeClientsRepository = new FakeClientsRepository();
    findClientsService = new FindClientsService(fakeClientsRepository);
  });

  it('should not be able to find a non-existing client', async () => {
    await expect(
      findClientsService.execute({
        clientId: 'non-existing-client',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to find a specific client', async () => {
    const client = await fakeClientsRepository.create({
      email: 'johndoe@exemple.com',
      name: 'Jonh Doe',
      password: '123456',
      postalCode: '00000000',
    });

    const findClient = await findClientsService.execute({
      clientId: client.id,
    });

    expect(findClient.id).toBe(client.id);
  });
});

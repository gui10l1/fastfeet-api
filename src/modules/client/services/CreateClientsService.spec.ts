import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/providers/HashProvider/fakes/FakeHashProvider';
import FakeClientsRepository from '../repositories/fakes/FakeClientsRepository';
import CreateClientsService from './CreateClientsService';

let fakeClientsRepository: FakeClientsRepository;
let fakeHashProvider: FakeHashProvider;
let createClientsService: CreateClientsService;

describe('CreateClients', () => {
  beforeEach(() => {
    fakeClientsRepository = new FakeClientsRepository();
    fakeHashProvider = new FakeHashProvider();
    createClientsService = new CreateClientsService(
      fakeClientsRepository,
      fakeHashProvider,
    );
  });

  it('should not be able to create a client with duplicated email', async () => {
    await fakeClientsRepository.create({
      name: 'John Doe',
      email: 'johndoe@exmeple.com',
      password: '123456',
      postalCode: '00000000',
    });

    await expect(
      createClientsService.execute({
        name: 'John Tre',
        email: 'johndoe@exemple.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a new client', async () => {
    const client = await createClientsService.execute({
      name: 'John Doe',
      email: 'johndoe@exmeple.com',
      password: '123456',
    });

    expect(client).toHaveProperty('id');
  });

  it("should be able to hash client's password", async () => {
    const spyOnHashMethod = jest.spyOn(fakeHashProvider, 'hash');

    await createClientsService.execute({
      name: 'John Doe',
      email: 'johndoe@exmeple.com',
      password: '123456',
    });

    expect(spyOnHashMethod).toHaveBeenCalledWith('123456');
  });
});

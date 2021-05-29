import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '@shared/providers/HashProvider/fakes/FakeHashProvider';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import FakeClientsRepository from '../../repositories/fakes/FakeClientsRepository';
import CreateClientsService from './CreateClientsService';

let fakeClientsRepository: FakeClientsRepository;
let fakeHashProvider: FakeHashProvider;
let createClientsService: CreateClientsService;
let fakeCacheProvider: FakeCacheProvider;
let fakeMailProvider: FakeMailProvider;

describe('CreateClients', () => {
  beforeEach(() => {
    fakeClientsRepository = new FakeClientsRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeMailProvider = new FakeMailProvider();
    fakeCacheProvider = new FakeCacheProvider();
    createClientsService = new CreateClientsService(
      fakeClientsRepository,
      fakeHashProvider,
      fakeMailProvider,
      fakeCacheProvider,
    );
  });

  it('should not be able to create a client with duplicated email', async () => {
    await fakeClientsRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
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

  it('should be able to send a confirmation email to the recent created client', async () => {
    const spyOnMailMethod = jest.spyOn(fakeMailProvider, 'sendMail');

    await createClientsService.execute({
      name: 'John Doe',
      email: 'johndoe@exmeple.com',
      password: '123456',
    });

    expect(spyOnMailMethod).toHaveBeenCalled();
  });
});

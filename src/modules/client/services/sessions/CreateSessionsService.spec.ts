import FakeClientsRepository from '@modules/client/repositories/fakes/FakeClientsRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/providers/HashProvider/fakes/FakeHashProvider';

import CreateSessionsService from './CreateSessionsService';

let fakeClientsRepository: FakeClientsRepository;
let fakeHashProvider: FakeHashProvider;
let createSessionsService: CreateSessionsService;

describe('CreateSessions', () => {
  beforeEach(() => {
    fakeClientsRepository = new FakeClientsRepository();
    fakeHashProvider = new FakeHashProvider();
    createSessionsService = new CreateSessionsService(
      fakeClientsRepository,
      fakeHashProvider,
    );
  });

  it('should not be able to create a sessions with incorrect email', async () => {
    await fakeClientsRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      createSessionsService.execute({
        email: 'johndoe@exemple.comm',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a sessions with incorrect password', async () => {
    await fakeClientsRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      createSessionsService.execute({
        email: 'johndoe@exemple.com',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a session', async () => {
    const client = await fakeClientsRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const { clientLogged } = await createSessionsService.execute({
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    expect(clientLogged.id).toBe(client.id);
  });
});

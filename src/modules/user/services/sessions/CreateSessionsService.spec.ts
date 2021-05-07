import FakeUsersRepository from '@modules/user/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/providers/HashProvider/fakes/FakeHashProvider';
import CreateSessionsService from './CreateSessionsService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createSessionsService: CreateSessionsService;

describe('CreateSessions', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createSessionsService = new CreateSessionsService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should not be able to create a sessions with incorrect CPF', async () => {
    await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      createSessionsService.execute({
        cpf: '00000000001',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a sessions with incorrect password', async () => {
    await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      createSessionsService.execute({
        cpf: '00000000000',
        password: '1234567',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to create a session', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const { userLogged } = await createSessionsService.execute({
      cpf: '00000000000',
      password: '123456',
    });

    expect(userLogged.id).toBe(user.id);
  });
});

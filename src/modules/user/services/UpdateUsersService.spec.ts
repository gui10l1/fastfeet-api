import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateUsersService from './UpdateUsersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUsersService: UpdateUsersService;

describe('UpdateUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    updateUsersService = new UpdateUsersService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should not be able to update a non-exisiting user', async () => {
    await expect(
      updateUsersService.execute({
        userId: 'non-existing-user',
        data: {
          name: 'John Doe',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update email to one that already exists', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      cpf: '00000000000',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntre@exemple.com',
      cpf: '11111111111',
      password: '123456',
    });

    await expect(
      updateUsersService.execute({
        userId: user.id,
        data: {
          name: 'John Qua',
          email: 'johndoe@exemple.com',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update CPF to one that already exists', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      cpf: '00000000000',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntre@exemple.com',
      cpf: '11111111111',
      password: '123456',
    });

    await expect(
      updateUsersService.execute({
        userId: user.id,
        data: {
          name: 'John Qua',
          cpf: '00000000000',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

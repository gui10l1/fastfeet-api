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

  it('should not be able to change the password if the old one is not provied', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      updateUsersService.execute({
        userId: user.id,
        data: {
          name: 'John Tre',
          password: '123123',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the password if the old one does not match', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      updateUsersService.execute({
        userId: user.id,
        data: {
          name: 'John Tre',
          password: '123123',
          oldPassword: 'wrong-old-password',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to hash the password', async () => {
    const spyOnHashPassword = jest.spyOn(fakeHashProvider, 'hash');

    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await updateUsersService.execute({
      userId: user.id,
      data: {
        name: 'John Tre',
        password: '123123',
        oldPassword: '123456',
      },
    });

    expect(spyOnHashPassword).toHaveBeenCalledWith('123123');
  });

  it('should be able to change user password', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const userUpdated = await updateUsersService.execute({
      userId: user.id,
      data: {
        name: 'John Tre',
        password: '123123',
        oldPassword: '123456',
      },
    });

    const passwordMatch = await fakeHashProvider.compare(
      '123123',
      userUpdated.password,
    );

    expect(passwordMatch).toBeTruthy();
  });

  it('should be able to update a user', async () => {
    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const updatedUser = await updateUsersService.execute({
      userId: user.id,
      data: {
        name: 'John Tre',
        cpf: '11111111111',
        email: 'johntre@exemple.com',
        deliveryMan: false,
      },
    });

    expect(updatedUser.name).toBe('John Tre');
    expect(updatedUser.cpf).toBe('11111111111');
    expect(updatedUser.email).toBe('johntre@exemple.com');
    expect(updatedUser.deliveryman).toBeFalsy();
  });
});

import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import CreateUsersService from './CreateUsersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUsersService: CreateUsersService;

describe('CreateUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUsersService = new CreateUsersService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should not be able to create a user with duplicated CPF', async () => {
    await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      createUsersService.execute({
        data: {
          cpf: '00000000000',
          email: 'johntre@exemple.com',
          name: 'John Tre',
          password: '123456',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a user with duplicated email', async () => {
    await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      createUsersService.execute({
        data: {
          cpf: '11111111111',
          email: 'johndoe@exemple.com',
          name: 'John Tre',
          password: '123456',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a admin user from a non-existing admin user', async () => {
    await expect(
      createUsersService.execute({
        adminId: 'non-existing-admin',
        data: {
          cpf: '11111111111',
          email: 'johntre@exemple.com',
          name: 'John Tre',
          password: '123456',
          deliveryMan: false,
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a admin user from a non-admin user', async () => {
    const deliveryMan = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      createUsersService.execute({
        adminId: deliveryMan.id,
        data: {
          cpf: '11111111111',
          email: 'johntre@exemple.com',
          name: 'John Tre',
          password: '123456',
          deliveryMan: false,
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a admin user when the admin id is not provided', async () => {
    await expect(
      createUsersService.execute({
        data: {
          cpf: '00000000000',
          email: 'johntre@exemple.com',
          name: 'John Tre',
          password: '123456',
          deliveryMan: true,
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to hash the password', async () => {
    const spyOnHashMethod = jest.spyOn(fakeHashProvider, 'hash');

    await createUsersService.execute({
      data: {
        cpf: '00000000000',
        email: 'johndoe@exemple.com',
        name: 'John Doe',
        password: '123456',
      },
    });

    expect(spyOnHashMethod).toHaveBeenCalledWith('123456');
  });

  it('should be able to create a new user', async () => {
    const user = await createUsersService.execute({
      data: {
        cpf: '00000000000',
        email: 'johndoe@exemple.com',
        name: 'John Doe',
        password: '123456',
      },
    });

    expect(user).toHaveProperty('id');
    expect(user.name).toBe('John Doe');
  });

  it('should be able to create a admin user', async () => {
    const admin = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      deliveryMan: false,
    });

    const user = await createUsersService.execute({
      adminId: admin.id,
      data: {
        cpf: '11111111111',
        email: 'johntre@exemple.com',
        name: 'John Tre',
        password: '123456',
        deliveryMan: true,
      },
    });

    expect(user.deliveryman).toBeTruthy();
  });
});

import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/providers/HashProvider/fakes/FakeHashProvider';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import UpdateUsersService from './UpdateUsersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateUsersService: UpdateUsersService;
let fakeMailProvider: FakeMailProvider;

describe('UpdateUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeMailProvider = new FakeMailProvider();
    updateUsersService = new UpdateUsersService(
      fakeUsersRepository,
      fakeHashProvider,
      fakeMailProvider,
    );
  });

  it('should not be able to update a non-exisiting user', async () => {
    jest
      .spyOn(fakeUsersRepository, 'findById')
      .mockImplementationOnce(async () => {
        return undefined;
      });

    const user = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      updateUsersService.execute({
        userToBeUpdated: user.id,
        userLogged: user.id,
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
        userToBeUpdated: user.id,
        userLogged: user.id,
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
        userToBeUpdated: user.id,
        userLogged: user.id,
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
        userToBeUpdated: user.id,
        userLogged: user.id,
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
        userToBeUpdated: user.id,
        userLogged: user.id,
        data: {
          name: 'John Tre',
          password: '123123',
          oldPassword: 'wrong-old-password',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change a different user if who is logged is not a admin user', async () => {
    const userLogged = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exmeple.com',
      name: 'John Doe',
      password: '123456',
    });

    const userToBeUpdated = await fakeUsersRepository.create({
      cpf: '11111111111',
      email: 'johntre@exmeple.com',
      name: 'John Tre',
      password: '123456',
    });

    await expect(
      updateUsersService.execute({
        userLogged: userLogged.id,
        userToBeUpdated: userToBeUpdated.id,
        data: {
          name: 'John Qua',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change a different user if who is logged is not a non-existing admin user', async () => {
    const userToBeUpdated = await fakeUsersRepository.create({
      cpf: '11111111111',
      email: 'johntre@exmeple.com',
      name: 'John Tre',
      password: '123456',
    });

    await expect(
      updateUsersService.execute({
        userLogged: 'non-existing-admin',
        userToBeUpdated: userToBeUpdated.id,
        data: {
          name: 'John Qua',
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
      userToBeUpdated: user.id,
      userLogged: user.id,
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
      userToBeUpdated: user.id,
      userLogged: user.id,
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
      userToBeUpdated: user.id,
      userLogged: user.id,
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

  it('should be able to admin user change another users', async () => {
    const userLogged = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      deliveryMan: false,
    });

    const userToBeUpdated = await fakeUsersRepository.create({
      cpf: '11111111111',
      email: 'johntre@exmeple.com',
      name: 'John Tre',
      password: '123456',
    });

    const userUpdated = await updateUsersService.execute({
      userLogged: userLogged.id,
      userToBeUpdated: userToBeUpdated.id,
      data: {
        name: 'John Qua',
      },
    });

    expect(userUpdated.name).toBe('John Qua');
  });

  it('should be able to send a email to confirm his (user) updated email', async () => {
    const spyOnMailMethod = jest.spyOn(fakeMailProvider, 'sendMail');

    const userLogged = await fakeUsersRepository.create({
      cpf: '00000000000',
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
      deliveryMan: false,
    });

    await updateUsersService.execute({
      userLogged: userLogged.id,
      userToBeUpdated: userLogged.id,
      data: {
        email: 'johntre@exemple.com',
      },
    });

    expect(spyOnMailMethod).toHaveBeenCalled();
  });
});

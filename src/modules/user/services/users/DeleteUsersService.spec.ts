import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import DeleteUsersService from './DeleteUsersService';

let fakeUsersRepository: FakeUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let deleteUsersService: DeleteUsersService;

describe('DeleteUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeCacheProvider = new FakeCacheProvider();
    deleteUsersService = new DeleteUsersService(
      fakeUsersRepository,
      fakeCacheProvider,
    );
  });

  it('should not be able for admin to delete a non-exisiting user', async () => {
    const userLogged = await fakeUsersRepository.create({
      name: 'John Doe',
      cpf: '00000000000',
      email: 'johndoe@exmeple.com',
      password: '123456',
      deliveryMan: false,
    });

    await expect(
      deleteUsersService.execute({
        userToDelete: 'non-exisitng-user',
        userLogged: userLogged.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a non-exisiting user', async () => {
    jest
      .spyOn(fakeUsersRepository, 'findById')
      .mockImplementationOnce(async () => {
        return undefined;
      });

    const userLogged = await fakeUsersRepository.create({
      name: 'John Doe',
      cpf: '00000000000',
      email: 'johndoe@exmeple.com',
      password: '123456',
      deliveryMan: false,
    });

    await expect(
      deleteUsersService.execute({
        userToDelete: userLogged.id,
        userLogged: userLogged.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to admins delete a non-exisiting user', async () => {
    const userLogged = await fakeUsersRepository.create({
      name: 'John Doe',
      cpf: '00000000000',
      email: 'johndoe@exmeple.com',
      password: '123456',
    });

    await expect(
      deleteUsersService.execute({
        userToDelete: 'non-exisitng-user',
        userLogged: userLogged.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to delete a another user without admin permissions', async () => {
    const userLogged = await fakeUsersRepository.create({
      name: 'John Doe',
      cpf: '00000000000',
      email: 'johndoe@exmeple.com',
      password: '123456',
    });

    const userToDelete = await fakeUsersRepository.create({
      name: 'John Tre',
      cpf: '11111111111',
      email: 'johntre@exmeple.com',
      password: '123456',
    });

    await expect(
      deleteUsersService.execute({
        userLogged: userLogged.id,
        userToDelete: userToDelete.id,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to a non-existig admin user to delete other users account', async () => {
    await expect(
      deleteUsersService.execute({
        userToDelete: 'non-existing-user',
        userLogged: 'non-existing-admin-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to user to delete his account', async () => {
    const userLogged = await fakeUsersRepository.create({
      name: 'John Doe',
      cpf: '00000000000',
      email: 'johndoe@exmeple.com',
      password: '123456',
    });

    await deleteUsersService.execute({
      userLogged: userLogged.id,
      userToDelete: userLogged.id,
    });

    const findUser = await fakeUsersRepository.findById(userLogged.id);

    expect(findUser).toBeUndefined();
  });

  it('should be able to admin to delete other users accounts', async () => {
    const userLogged = await fakeUsersRepository.create({
      name: 'John Doe',
      cpf: '00000000000',
      email: 'johndoe@exmeple.com',
      password: '123456',
      deliveryMan: false,
    });

    const userToDelete = await fakeUsersRepository.create({
      name: 'John Tre',
      cpf: '11111111111',
      email: 'johntre@exmeple.com',
      password: '123456',
    });

    await deleteUsersService.execute({
      userLogged: userLogged.id,
      userToDelete: userToDelete.id,
    });

    const findUser = await fakeUsersRepository.findById(userToDelete.id);

    expect(findUser).toBeUndefined();
  });
});

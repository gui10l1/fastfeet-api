import AppError from '@shared/errors/AppError';
import FakeCacheProvider from '@shared/providers/CacheProvider/fakes/FakeCacheProvider';
import FakeHashProvider from '@shared/providers/HashProvider/fakes/FakeHashProvider';
import FakeMailProvider from '@shared/providers/MailProvider/fakes/FakeMailProvider';
import FakeClientsRepository from '../../repositories/fakes/FakeClientsRepository';
import UpdateClientsService from './UpdateClientsService';

let fakeClientsRepository: FakeClientsRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let updateClientsService: UpdateClientsService;
let fakeMailProvider: FakeMailProvider;

describe('UpdateClients', () => {
  beforeEach(() => {
    fakeClientsRepository = new FakeClientsRepository();
    fakeHashProvider = new FakeHashProvider();
    fakeMailProvider = new FakeMailProvider();
    fakeCacheProvider = new FakeCacheProvider();
    updateClientsService = new UpdateClientsService(
      fakeClientsRepository,
      fakeHashProvider,
      fakeMailProvider,
      fakeCacheProvider,
    );
  });

  it('should not be able to update a non-existing client', async () => {
    await expect(
      updateClientsService.execute({
        clientLogged: 'client-logged-id',
        data: {
          postalCode: '11111111',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to change client's email to one that already exists", async () => {
    await fakeClientsRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const clientLogged = await fakeClientsRepository.create({
      email: 'johntre@exemple.com',
      password: '123456',
      name: 'John Tre',
    });

    await expect(
      updateClientsService.execute({
        clientLogged: clientLogged.id,
        data: {
          email: 'johndoe@exemple.com',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to change client's password without provide the old one", async () => {
    const clientLogged = await fakeClientsRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      updateClientsService.execute({
        clientLogged: clientLogged.id,
        data: {
          password: '123123',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be not be able to change client's password when the old one does not match", async () => {
    const clientLogged = await fakeClientsRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await expect(
      updateClientsService.execute({
        clientLogged: clientLogged.id,
        data: {
          password: '123123',
          oldPassword: '123123',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update client's password", async () => {
    const spyOnHashProviderMethod = jest.spyOn(fakeHashProvider, 'hash');

    const clientLogged = await fakeClientsRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    const clientUpdated = await updateClientsService.execute({
      clientLogged: clientLogged.id,
      data: {
        password: '123123',
        oldPassword: '123456',
      },
    });

    expect(clientUpdated.password).toBe('123123');
    expect(spyOnHashProviderMethod).toHaveBeenCalledWith('123123');
  });

  it('should be able to update a client', async () => {
    const clientLogged = await fakeClientsRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    const clientUpdated = await updateClientsService.execute({
      clientLogged: clientLogged.id,
      data: {
        postalCode: '00000000',
        email: 'johntre@exemple.com',
      },
    });

    expect(clientUpdated.postal_code).toBe('00000000');
    expect(clientUpdated.email).toBe('johntre@exemple.com');
  });

  it('should be able to send a email to confirm his (client) updated email', async () => {
    const spyOnMailMethod = jest.spyOn(fakeMailProvider, 'sendMail');

    const clientLogged = await fakeClientsRepository.create({
      email: 'johndoe@exemple.com',
      name: 'John Doe',
      password: '123456',
    });

    await updateClientsService.execute({
      clientLogged: clientLogged.id,
      data: {
        email: 'johntre@exmeple.com',
      },
    });

    expect(spyOnMailMethod).toHaveBeenCalled();
  });
});

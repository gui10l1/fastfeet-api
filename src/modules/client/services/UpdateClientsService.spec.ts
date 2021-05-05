import AppError from '@shared/errors/AppError';
import FakeHashProvider from '@shared/providers/HashProvider/fakes/FakeHashProvider';
import FakeClientsRepository from '../repositories/fakes/FakeClientsRepository';
import UpdateClientsService from './UpdateClientsService';

let fakeClientsRepository: FakeClientsRepository;
let fakeHashProvider: FakeHashProvider;
let updateClientsService: UpdateClientsService;

describe('UpdateClients', () => {
  beforeEach(() => {
    fakeClientsRepository = new FakeClientsRepository();
    fakeHashProvider = new FakeHashProvider();
    updateClientsService = new UpdateClientsService(
      fakeClientsRepository,
      fakeHashProvider,
    );
  });

  it('should not be able to update a non-existing client', async () => {
    await expect(
      updateClientsService.execute({
        clientLogged: 'client-logged-id',
        clientToBeUpdated: 'client-logged-id',
        data: {
          postalCode: '11111111',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to a client update another client account', async () => {
    const clientLogged = await fakeClientsRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    const clientToBeUpdated = await fakeClientsRepository.create({
      name: 'John Tre',
      email: 'johntre@exemple.com',
      password: '123456',
      postalCode: '00000000',
    });

    await expect(
      updateClientsService.execute({
        clientLogged: clientLogged.id,
        clientToBeUpdated: clientToBeUpdated.id,
        data: {
          postalCode: '11111111',
        },
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update a client', async () => {
    const clientLogged = await fakeClientsRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      password: '123456',
    });

    const clientUpdated = await updateClientsService.execute({
      clientLogged: clientLogged.id,
      clientToBeUpdated: clientLogged.id,
      data: {
        postalCode: '00000000',
      },
    });

    expect(clientUpdated.postal_code).toBe('00000000');
  });
});

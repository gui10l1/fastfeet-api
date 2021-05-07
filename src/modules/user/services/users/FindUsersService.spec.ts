import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import FindUsersService from './FindUsersService';

let fakeUsersRepository: FakeUsersRepository;
let findUsersService: FindUsersService;

describe('FindUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    findUsersService = new FindUsersService(fakeUsersRepository);
  });

  it('should not be able to find a non-existing user', async () => {
    await expect(
      findUsersService.execute({
        userId: 'non-exisitng-user',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to find a user', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exemple.com',
      cpf: '00000000000',
      password: '123456',
    });

    const findUser = await findUsersService.execute({
      userId: user.id,
    });

    expect(findUser.id).toBe(user.id);
  });
});

import FakeUsersRepository from '../../repositories/fakes/FakeUsersRepository';
import ListUsersService from './ListUsersService';

let fakeUsersRepository: FakeUsersRepository;
let listUsersService: ListUsersService;

describe('ListUsers', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    listUsersService = new ListUsersService(fakeUsersRepository);
  });

  it('should be able to list all created users', async () => {
    const userOne = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@exmeple.com',
      cpf: '00000000000',
      password: '123456',
    });

    const userTwo = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'johntre@exmeple.com',
      cpf: '11111111111',
      password: '123456',
    });

    const users = await listUsersService.execute();

    expect(users).toEqual([userOne, userTwo]);
  });
});

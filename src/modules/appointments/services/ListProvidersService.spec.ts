import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersService: ListProvidersService;

describe('ListProviders', () => {
  beforeAll(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProvidersService = new ListProvidersService(fakeUsersRepository);
  });
  it('Deve ser capaz de listar os prestadores', async () => {
    const userProvider1 = await fakeUsersRepository.create({
      name: 'Prestador 1',
      email: 'prestador1@gobarber.com.br',
      password: '123456',
    });

    const userProvider2 = await fakeUsersRepository.create({
      name: 'Prestador 2',
      email: 'prestador2@gobarber.com.br',
      password: '123456',
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    const providers = await listProvidersService.execute({
      user_id: loggedUser.id,
    });

    expect(providers).toEqual([userProvider1, userProvider2]);
  });
});

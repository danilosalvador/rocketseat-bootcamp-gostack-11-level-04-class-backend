import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import ShowProfileService from './ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

describe('ShowProfile', () => {
  beforeAll(() => {
    fakeUsersRepository = new FakeUsersRepository();

    showProfileService = new ShowProfileService(fakeUsersRepository);
  });

  it('Deve ser capar de visualizar as informações do usuário', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    const profile = await showProfileService.execute({
      user_id: user.id,
    });

    expect(profile.name).toBe('Danilo Salvador');
    expect(profile.email).toBe('danilo.salvador@smartlogic.com.br');
  });

  it('Não deve ser capaz de visualizar as informações com um usuário inválido', async () => {
    await expect(
      showProfileService.execute({ user_id: 'usuario_invalido' }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

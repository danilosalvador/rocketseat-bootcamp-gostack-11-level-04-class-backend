import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import UpdateProfileService from './UpdateProfileService';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfileService: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();
    updateProfileService = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Deve ser capar de atualizar o profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Danilo Salvador 1',
      email: 'danilo.salvador1@smartlogic.com.br',
    });

    expect(updatedUser.name).toBe('Danilo Salvador 1');
    expect(updatedUser.email).toBe('danilo.salvador1@smartlogic.com.br');
  });

  it('Não deve ser capaz de atualizar com um usuário inválido', async () => {
    await expect(
      updateProfileService.execute({
        user_id: 'usuario_invalido',
        name: 'Danilo Salvador',
        email: 'danilo.salvador@smartlogic.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve ser capaz de atualizar para um e-mail que já está sendo utilizado', async () => {
    await fakeUsersRepository.create({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'Danilo Salvador 1',
      email: 'danilo.salvador1@smartlogic.com.br',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Danilo Salvador',
        email: 'danilo.salvador@smartlogic.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve ser capaz de atualizar a senha', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    const updatedUser = await updateProfileService.execute({
      user_id: user.id,
      name: 'Danilo Salvador 1',
      email: 'danilo.salvador1@smartlogic.com.br',
      old_password: '123456',
      new_password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('Não deve ser capaz de atualizar a senha sem informar a senha antiga', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Danilo Salvador 1',
        email: 'danilo.salvador1@smartlogic.com.br',
        new_password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve ser capaz de atualizar a senha com uma senha anterior incorreta', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    await expect(
      updateProfileService.execute({
        user_id: user.id,
        name: 'Danilo Salvador 1',
        email: 'danilo.salvador1@smartlogic.com.br',
        old_password: 'senha_incorreta',
        new_password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

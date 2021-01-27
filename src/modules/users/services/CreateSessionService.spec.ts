import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import AppError from '@shared/errors/AppError';
import CreateSessionService from './CreateSessionService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createSessionService: CreateSessionService;

describe('CreateSession', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createSessionService = new CreateSessionService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Deve ser capaz de criar uma sessão', async () => {
    const user = await fakeUsersRepository.create({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    const response = await createSessionService.Execute({
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('Não deve ser capaz de criar uma sessão com usuário inválido', async () => {
    await expect(
      createSessionService.Execute({
        email: 'danilo.salvador@smartlogic.com.br',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve ser capaz de criar uma sessão com senha inválida', async () => {
    await fakeUsersRepository.create({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    await expect(
      createSessionService.Execute({
        email: 'danilo.salvador@smartlogic.com.br',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

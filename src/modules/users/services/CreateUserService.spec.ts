import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';

import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('Deve ser capaz de criar um novo usuário', async () => {
    const user = await createUserService.Execute({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    expect(user).toHaveProperty('id');
  });

  it('Não deve ser capaz de criar um usuário com o mesmo e-mail.', async () => {
    await fakeUsersRepository.create({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    await expect(
      createUserService.Execute({
        name: 'Danilo Salvador',
        email: 'danilo.salvador@smartlogic.com.br',
        password: '654321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

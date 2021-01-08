import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorangeProvider from '@shared/container/providers/StorangeProvider/fakes/FakeStorangeProvider';
import AppError from '@shared/errors/AppError';
import UpdateUserAvatarService from './UpdateUserAvatarService';

describe('UpdateUserAvatar', () => {
  it('Deve ser capaz de atualizar avatar', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorangeProvider = new FakeStorangeProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorangeProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    const userAvatarUpdated = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar.png',
    });

    expect(userAvatarUpdated.avatar).toBe('avatar.png');
  });

  it('Não deve ser capaz de atualizar o avatar para um usuário inexistente', () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorangeProvider = new FakeStorangeProvider();

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorangeProvider,
    );

    expect(
      updateUserAvatarService.execute({
        user_id: '0',
        avatarFileName: 'avatar.png',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve ser capaz de apagar o avatar antigo antes de salvar o novo', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeStorangeProvider = new FakeStorangeProvider();

    const deleteFile = spyOn(fakeStorangeProvider, 'deleteFile');

    const updateUserAvatarService = new UpdateUserAvatarService(
      fakeUsersRepository,
      fakeStorangeProvider,
    );

    const user = await fakeUsersRepository.create({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar01.png',
    });

    const userAvatarUpdated = await updateUserAvatarService.execute({
      user_id: user.id,
      avatarFileName: 'avatar02.png',
    });

    expect(deleteFile).toBeCalledWith('avatar01.png');
    expect(userAvatarUpdated.avatar).toBe('avatar02.png');
  });
});

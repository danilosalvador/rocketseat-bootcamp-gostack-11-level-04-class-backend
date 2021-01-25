import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequestDTO {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({
    user_id,
    avatarFileName,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não econtrado.', 401);
    }

    if (user.avatar) {
      // Apaga o arquivo de avatar antigo
      await this.storageProvider.deleteFile(user.avatar);
    }

    // Salva o novo arquivo de avatar
    const fileName = await this.storageProvider.saveFile(avatarFileName);

    user.avatar = fileName;
    await this.usersRepository.update(user);

    return user;
  }
}

export default UpdateUserAvatarService;

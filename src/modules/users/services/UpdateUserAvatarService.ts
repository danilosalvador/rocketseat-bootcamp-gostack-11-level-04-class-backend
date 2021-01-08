import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorangeProvider from '@shared/container/providers/StorangeProvider/models/IStorangeProvider';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequestDTO {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRespository')
    private usersRepository: IUsersRepository,

    @inject('StorangeProvider')
    private storangeProvider: IStorangeProvider,
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
      await this.storangeProvider.deleteFile(user.avatar);
    }

    // Salva o novo arquivo de avatar
    const fileName = await this.storangeProvider.saveFile(avatarFileName);

    user.avatar = fileName;
    await this.usersRepository.update(user);

    return user;
  }
}

export default UpdateUserAvatarService;

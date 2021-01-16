import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  new_password?: string;
}

@injectable()
class UpdateProfileService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    user_id,
    name,
    email,
    old_password,
    new_password,
  }: IRequestDTO): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado');
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email);

    if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError('O e-mail já está sendo utilizado.');
    }

    Object.assign(user, { name, email });

    if (new_password && !old_password) {
      throw new AppError(
        'É necessário informar a senha antiga para atualização de uma nova senha',
      );
    }

    if (old_password && new_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Senha antiga incorreta');
      }

      user.password = await this.hashProvider.generateHash(new_password);
    }

    return this.usersRepository.update(user);
  }
}

export default UpdateProfileService;

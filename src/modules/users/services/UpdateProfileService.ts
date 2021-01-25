import { inject, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';

interface IRequestDTO {
  user_id: string;
  name: string;
  email: string;
  password_old?: string;
  password_new?: string;
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
    password_old,
    password_new,
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

    if (password_new && !password_old) {
      throw new AppError(
        'É necessário informar a senha antiga para atualização de uma nova senha',
      );
    }

    if (password_old && password_new) {
      const checkOldPassword = await this.hashProvider.compareHash(
        password_old,
        user.password,
      );

      if (!checkOldPassword) {
        throw new AppError('Senha antiga incorreta');
      }

      user.password = await this.hashProvider.generateHash(password_new);
    }

    return this.usersRepository.update(user);
  }
}

export default UpdateProfileService;

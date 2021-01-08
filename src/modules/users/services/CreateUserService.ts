import { inject, injectable } from 'tsyringe';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import IUsersRespository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';

interface IRequestDTO {
  name: string;
  email: string;
  password: string;
}

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRespository')
    private usersRespository: IUsersRespository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async Execute({ name, email, password }: IRequestDTO): Promise<User> {
    const checkEmailExist = await this.usersRespository.findByEmail(email);

    if (checkEmailExist) {
      throw new AppError('Email informado já foi cadastrado.');
    }

    const hashedPassword = await this.hashProvider.generateHash(password);

    const user = await this.usersRespository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;

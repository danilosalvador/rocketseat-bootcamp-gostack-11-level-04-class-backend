import { inject, injectable } from 'tsyringe';
import { hash } from 'bcryptjs';

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
  ) {}

  public async Execute({ name, email, password }: IRequestDTO): Promise<User> {
    const checkEmailExist = await this.usersRespository.findByEmail(email);

    if (checkEmailExist) {
      throw new AppError('Email informado já foi cadastrado.');
    }

    const hashedPassword = await hash(password, 8);

    const user = await this.usersRespository.create({
      name,
      email,
      password: hashedPassword,
    });

    return user;
  }
}

export default CreateUserService;

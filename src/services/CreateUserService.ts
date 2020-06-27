import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import AppError from '../errors/AppError';
import User from '../models/User';

interface RequestDTO {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  public async Execute({ name, email, password }: RequestDTO): Promise<User> {
    const userRespository = getRepository(User);

    const checkEmailExist = await userRespository.findOne({
      where: { email },
    });

    if (checkEmailExist) {
      throw new AppError('Email informado já foi cadastrado.');
    }

    const hashedPassword = await hash(password, 8);

    const user = userRespository.create({
      name,
      email,
      password: hashedPassword,
    });

    await userRespository.save(user);

    return user;
  }
}

export default CreateUserService;

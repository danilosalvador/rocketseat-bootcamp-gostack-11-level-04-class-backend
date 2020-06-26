import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

interface RequestDTO {
  email: string;
  password: string;
}

interface ResponseDTO {
  user: User;
  token: string;
}

class CreateSessionService {
  public async Execute({ email, password }: RequestDTO): Promise<ResponseDTO> {
    const usersRepository = getRepository(User);

    const user = await usersRepository.findOne({ where: { email } });

    if (!user) {
      throw new Error('Email e/ou senha incorreta.');
    }

    const passwordMatched = await compare(password, user.password);

    if (!passwordMatched) {
      throw new Error('Email e/ou senha incorreta.');
    }

    const token = sign({}, '5a55665d11da2ddc11b7b14d8dc4294b', {
      subject: user.id,
      expiresIn: '8h',
    });

    return { user, token };
  }
}

export default CreateSessionService;

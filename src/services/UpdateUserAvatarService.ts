import path from 'path';
import fs from 'fs';
import { getRepository } from 'typeorm';

import User from '../models/User';
import uploadConfig from '../config/upload';

interface RequestDTO {
  user_id: string;
  avatarFileName: string;
}

class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: RequestDTO): Promise<User> {
    const userRepository = getRepository(User);

    const user = await userRepository.findOne(user_id);

    if (!user) {
      throw new Error('Usuário não econtrado.');
    }

    if (user.avatar) {
      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar);

      const userAvatarFileExists = fs.existsSync(userAvatarFilePath);

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath);
      }
    }

    user.avatar = avatarFileName;
    userRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;

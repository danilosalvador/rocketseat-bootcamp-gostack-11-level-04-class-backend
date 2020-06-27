import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '../config/upload';
import ensureSession from '../middlewares/ensureSession';

import CreateUserService from '../services/CreateUserService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRoute = Router();
const upload = multer(uploadConfig);

usersRoute.post('/', async (request, response) => {
  try {
    const { name, email, password } = request.body;

    const createUserService = new CreateUserService();

    const user = await createUserService.Execute({
      name,
      email,
      password,
    });

    delete user.password;

    return response.json(user);
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

usersRoute.patch(
  '/avatar',
  ensureSession,
  upload.single('avatar'),
  async (request, response) => {
    try {
      const updateUSerAvatar = new UpdateUserAvatarService();

      const user = await updateUSerAvatar.execute({
        user_id: request.user.id,
        avatarFileName: request.file.filename,
      });

      delete user.password;

      return response.json(user);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  },
);

export default usersRoute;

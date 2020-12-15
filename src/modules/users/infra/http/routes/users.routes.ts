import { Router } from 'express';
import multer from 'multer';

import uploadConfig from '@config/upload';
import ensureSession from '@modules/users/infra/http/middlewares/ensureSession';

import UsersController from '@modules/users/infra/http/controllers/UsersConstroller';
import UserAvatarControler from '@modules/users/infra/http/controllers/UserAvatarController';

const usersRoute = Router();
const upload = multer(uploadConfig);
const usersController = new UsersController();
const userAvatarController = new UserAvatarControler();

usersRoute.post('/', usersController.create);

usersRoute.patch(
  '/avatar',
  ensureSession,
  upload.single('avatar'),
  userAvatarController.update,
);

export default usersRoute;

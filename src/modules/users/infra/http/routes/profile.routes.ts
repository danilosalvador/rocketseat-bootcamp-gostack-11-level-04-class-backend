import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureSession from '@modules/users/infra/http/middlewares/ensureSession';
import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

const profileRoute = Router();
const profileController = new ProfileController();

profileRoute.use(ensureSession);

profileRoute.get('/', profileController.show);

profileRoute.put(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password_old: Joi.string(),
      password_new: Joi.string(),
      password_confirmation: Joi.string().valid(Joi.ref('password_new')),
    },
  }),
  profileController.update,
);

export default profileRoute;

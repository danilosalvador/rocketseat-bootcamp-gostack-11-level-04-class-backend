import { Router } from 'express';

import ensureSession from '@modules/users/infra/http/middlewares/ensureSession';
import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

const profileRoute = Router();
const profileController = new ProfileController();

profileRoute.use(ensureSession);

profileRoute.get('/', profileController.show);
profileRoute.put('/', profileController.update);

export default profileRoute;

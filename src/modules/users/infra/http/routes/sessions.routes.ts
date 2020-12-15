import { Router } from 'express';

import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const sessionsRoute = Router();
const sessionsConstroller = new SessionsController();

sessionsRoute.post('/', sessionsConstroller.create);

export default sessionsRoute;

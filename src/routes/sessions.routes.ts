import { Router } from 'express';

import CreateSessionService from '../services/CreateSessionService';

const sessionsRoute = Router();

sessionsRoute.post('/', async (request, response) => {
  const { email, password } = request.body;

  const createSessionService = new CreateSessionService();

  const { user, token } = await createSessionService.Execute({
    email,
    password,
  });

  delete user.password;

  return response.json({ user, token });
});

export default sessionsRoute;

import { Router } from 'express';

import CreateSessionService from '../services/CreateSessionService';

const sessionsRoute = Router();

sessionsRoute.post('/', async (request, response) => {
  try {
    const { email, password } = request.body;

    const createSessionService = new CreateSessionService();

    const { user, token } = await createSessionService.Execute({
      email,
      password,
    });

    delete user.password;

    return response.json({ user, token });
  } catch (err) {
    return response.status(400).json({ error: err.message });
  }
});

export default sessionsRoute;

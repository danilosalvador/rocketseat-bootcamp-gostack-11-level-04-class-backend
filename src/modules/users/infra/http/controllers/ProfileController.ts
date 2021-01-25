import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UpdateProfileService from '@modules/users/services/UpdateProfileService';
import ShowProfileService from '@modules/users/services/ShowProfileService';

class ProfileController {
  public async show(request: Request, response: Response): Promise<Response> {
    const user_id = request.user.id;

    const showProfileService = container.resolve(ShowProfileService);

    const user = await showProfileService.execute({ user_id });

    return response.json({ user: classToClass(user) });
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { name, email, password_old, password_new } = request.body;
    const user_id = request.user.id;

    const updateProfileService = container.resolve(UpdateProfileService);

    const user = await updateProfileService.execute({
      user_id,
      name,
      email,
      password_old,
      password_new,
    });

    return response.json({ user: classToClass(user) });
  }
}

export default ProfileController;

import { Router } from 'express';

import ForgotPasswordController from '@modules/users/infra/http/controllers/ForgotPasswordController';
import ResetPasswordController from '@modules/users/infra/http/controllers/ResetPasswordController';

const passwordRoute = Router();

const forgotPasswordController = new ForgotPasswordController();
const resetPasswordController = new ResetPasswordController();

passwordRoute.post('/forgot', forgotPasswordController.create);
passwordRoute.post('/reset', resetPasswordController.create);

export default passwordRoute;

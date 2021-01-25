import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureSession from '@modules/users/infra/http/middlewares/ensureSession';

import ProviderController from '@modules/appointments/infra/http/controllers/ProviderController';
import ProviderDayAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderDayAvailabilityController';
import ProviderMonthAvailabilityController from '@modules/appointments/infra/http/controllers/ProviderMonthAvailabilityController';

const providersRoute = Router();

const providerController = new ProviderController();
const providerDayAvailabilityContrroller = new ProviderDayAvailabilityController();
const providerMonthAvailabilityContrroller = new ProviderMonthAvailabilityController();

providersRoute.use(ensureSession);

providersRoute.get('/', providerController.index);

providersRoute.get(
  '/:provider_id/availability-day',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      year: Joi.number().required,
      month: Joi.number().required,
      day: Joi.number().required,
    },
  }),
  providerDayAvailabilityContrroller.index,
);

providersRoute.get(
  '/:provider_id/availability-month',
  celebrate({
    [Segments.PARAMS]: {
      provider_id: Joi.string().uuid().required(),
    },
    [Segments.BODY]: {
      year: Joi.number().required,
      month: Joi.number().required,
      day: Joi.number().required,
    },
  }),
  providerMonthAvailabilityContrroller.index,
);

export default providersRoute;

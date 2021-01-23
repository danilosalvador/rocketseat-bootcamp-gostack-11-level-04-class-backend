import { Router } from 'express';

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
  providerDayAvailabilityContrroller.index,
);

providersRoute.get(
  '/:provider_id/availability-month',
  providerMonthAvailabilityContrroller.index,
);

export default providersRoute;

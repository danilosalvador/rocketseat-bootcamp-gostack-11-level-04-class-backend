import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

describe('CreateAppointment', () => {
  it('Deve ser capaz de criar um novo agendamento', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentServices = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const appointment = await createAppointmentServices.execute({
      date: new Date(),
      provider_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('Não deve ser capaz de criar um novo agendamento no mesmo horário', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointmentServices = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );

    const date = new Date();

    await createAppointmentServices.execute({
      date,
      provider_id: '123123',
    });

    expect(
      createAppointmentServices.execute({
        date,
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

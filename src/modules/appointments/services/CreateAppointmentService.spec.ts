import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointmentService: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointmentService = new CreateAppointmentService(
      fakeAppointmentsRepository,
    );
  });

  it('Deve ser capaz de criar um novo agendamento', async () => {
    const appointment = await createAppointmentService.execute({
      date: new Date(),
      provider_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('Não deve ser capaz de criar um novo agendamento no mesmo horário', async () => {
    const date = new Date();

    await createAppointmentService.execute({
      date,
      provider_id: '123123',
    });

    await expect(
      createAppointmentService.execute({
        date,
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

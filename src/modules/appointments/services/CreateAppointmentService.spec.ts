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
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 18, 10).getTime();
    });

    const appointment = await createAppointmentService.execute({
      date: new Date(2021, 0, 18, 12),
      user_id: '987654',
      provider_id: '123123',
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('123123');
  });

  it('Não deve ser capaz de criar um novo agendamento no mesmo horário', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 18, 10).getTime();
    });

    await createAppointmentService.execute({
      date: new Date(2021, 0, 18, 12),
      user_id: '987654',
      provider_id: '123123',
    });

    await expect(
      createAppointmentService.execute({
        date: new Date(2021, 0, 18, 12),
        user_id: '987654',
        provider_id: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve ser capaz de criar um novo agendamento em uma data anterior do que a atual', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2121, 0, 18, 10).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2121, 0, 18, 9),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve ser capaz de criar um novo agendamento com o mesmo usuário prestador', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2121, 0, 18, 10).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'same_provider_id',
        user_id: 'same_provider_id',
        date: new Date(2121, 0, 18, 9),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Não deve ser capaz de criar um novo agendamento fora do horário de funcionamento do estabelecimento', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2121, 0, 18, 10).getTime();
    });

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2121, 0, 18, 7),
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointmentService.execute({
        provider_id: 'provider',
        user_id: 'user',
        date: new Date(2121, 0, 18, 21),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});

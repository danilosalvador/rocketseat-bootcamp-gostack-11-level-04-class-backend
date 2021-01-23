import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from './ListProviderDayAvailabilityService';

let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe('ListProviderDayAvailability', () => {
  beforeAll(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();

    listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
      fakeAppointmentRepository,
    );
  });

  it('Deve ser capaz de listar a agenda de disponibilidade do prestador em um dia', async () => {
    await fakeAppointmentRepository.create({
      provider_id: 'user_id',
      user_id: '987654',
      date: new Date(2021, 0, 18, 10, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user_id',
      user_id: '987654',
      date: new Date(2021, 0, 18, 11, 0, 0),
    });

    await fakeAppointmentRepository.create({
      provider_id: 'user_id',
      user_id: '987654',
      date: new Date(2021, 0, 18, 13, 0, 0),
    });

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2021, 0, 18, 9).getTime(); // Para simuladar a data de agora para 2021-01-18 09:00
    });

    const availabilities = await listProviderDayAvailabilityService.execute({
      provider_id: 'user_id',
      day: 18,
      month: 1,
      year: 2021,
    });

    expect(availabilities).toEqual(
      expect.arrayContaining([
        { hour: 8, available: false }, // Hora anterior sem agendamento
        { hour: 9, available: false }, // Hora de agora sem agendamento
        { hour: 10, available: false }, // Hora com agendamento
        { hour: 11, available: false }, // Hora com agendamento
        { hour: 13, available: false }, // Hora com agendamento
        { hour: 14, available: true }, // Hora disponível
      ]),
    );
  });
});

import FakeAppointmentRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderMonthAvailabilityService from './ListProviderMonthAvailabilityService';

let listProviderMonthAvailabilityService: ListProviderMonthAvailabilityService;
let fakeAppointmentRepository: FakeAppointmentRepository;

describe('ListProviderMonthAvailability', () => {
  beforeAll(() => {
    fakeAppointmentRepository = new FakeAppointmentRepository();

    listProviderMonthAvailabilityService = new ListProviderMonthAvailabilityService(
      fakeAppointmentRepository,
    );
  });

  it('Deve ser capaz de listar a agenda de disponibilidade do prestador em um mês', async () => {
    const hourStart = 8;

    // Day: 18
    Array.from({ length: 10 }, async (_, index) => {
      const hour = index + hourStart;

      await fakeAppointmentRepository.create({
        provider_id: 'user_id',
        user_id: '987654',
        date: new Date(2021, 0, 18, hour, 0, 0),
      });
    });

    // Day: 19
    Array.from({ length: 10 }, async (_, index) => {
      const hour = index + hourStart;

      await fakeAppointmentRepository.create({
        provider_id: 'user_id',
        user_id: '987654',
        date: new Date(2021, 0, 19, hour, 0, 0),
      });
    });

    const availabilities = await listProviderMonthAvailabilityService.execute({
      provider_id: 'user_id',
      month: 1,
      year: 2021,
    });

    expect(availabilities).toEqual(
      expect.arrayContaining([
        { day: 17, available: true },
        { day: 18, available: false },
        { day: 19, available: false },
        { day: 20, available: true },
      ]),
    );
  });
});

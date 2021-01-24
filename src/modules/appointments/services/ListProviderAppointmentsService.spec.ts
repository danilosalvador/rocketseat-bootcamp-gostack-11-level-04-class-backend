import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

describe('ListProviderAppointmentsService', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();

    listProviderAppointmentsService = new ListProviderAppointmentsService(
      fakeAppointmentsRepository,
    );
  });

  it('Deve ser capaz de listar os agendamentos para um prestador de um dia específico', async () => {
    const appointment1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 0, 18, 10, 0, 0),
    });

    const appointment2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider_id',
      user_id: 'user_id',
      date: new Date(2021, 0, 18, 11, 0, 0),
    });

    const appointment3 = await fakeAppointmentsRepository.create({
      provider_id: 'other_provider_id',
      user_id: 'user_id',
      date: new Date(2021, 0, 18, 11, 0, 0),
    });

    const appointments = await listProviderAppointmentsService.execute({
      provider_id: 'provider_id',
      year: 2021,
      month: 1,
      day: 18,
    });

    expect(appointments).toEqual([appointment1, appointment2]);
    expect(appointments).not.toContain(appointment3);
  });
});

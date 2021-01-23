import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
  provider_id: string;
  month: number;
  year: number;
}

type IResponse = Array<{
  day: number;
  available: boolean;
}>;

@injectable()
class ListProviderMonthAvailabilityService {
  constructor(
    @inject('AppointmentsRepository')
    private appointmentsRepository: IAppointmentsRepository,
  ) {}

  public async execute({
    provider_id,
    month,
    year,
  }: IRequest): Promise<IResponse> {
    // Agendamentos do prestador no BD
    const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
      {
        provider_id,
        month,
        year,
      },
    );

    // Total de dias do mês
    const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

    // Array de dias do mês
    const eachDayArray = Array.from(
      { length: numberOfDaysInMonth },
      (_, index) => index + 1,
    );

    const availability = eachDayArray.map(day => {
      // Agendamentos do dia
      const appointmentsInDay = appointments.filter(
        item => getDate(item.date) === day,
      );

      return {
        day,
        available: appointmentsInDay.length < 10, // Horário das 8h às 17h (limite de 10 agendamentos no dia)
      };
    });

    return availability;
  }
}

export default ListProviderMonthAvailabilityService;

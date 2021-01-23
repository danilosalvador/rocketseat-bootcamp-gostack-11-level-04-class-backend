import { uuid } from 'uuidv4';
import { isEqual, getDate, getMonth, getYear } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentsDTO from '@modules/appointments/dtos/ICreateAppointmentsDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayProviderDTO';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

class FakeAppointmentsRepository implements IAppointmentsRepository {
  private appointments: Appointment[] = [];

  public async findByDate(date: Date): Promise<Appointment | undefined> {
    const findAppointment = await this.appointments.find(appointment =>
      isEqual(appointment.date, date),
    );

    return findAppointment || undefined;
  }

  public async create({
    provider_id,
    user_id,
    date,
  }: ICreateAppointmentsDTO): Promise<Appointment> {
    const appointment = new Appointment();

    // appointment.id = uuid();
    // appointment.provider_id = provider_id;
    // appointment.date = date;
    Object.assign(appointment, {
      id: uuid(),
      provider_id,
      user_id,
      date,
    });

    this.appointments.push(appointment);

    return appointment;
  }

  public async findAllInMonthFromProvider({
    provider_id,
    month,
    year,
  }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
    const appointments = await this.appointments.filter(item => {
      return (
        item.provider_id === provider_id &&
        getMonth(item.date) + 1 === month &&
        getYear(item.date) === year
      );
    });

    return appointments;
  }

  public async findAllInDayFromProvider({
    provider_id,
    year,
    month,
    day,
  }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
    const appointments = await this.appointments.filter(item => {
      return (
        item.provider_id === provider_id &&
        getDate(item.date) === day &&
        getMonth(item.date) + 1 === month &&
        getYear(item.date) === year
      );
    });

    return appointments;
  }
}

export default FakeAppointmentsRepository;

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeMailProvider from '@shared/container/providers/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';

let fakeUsersRepository: FakeUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakeUserTokensRepository: FakeUserTokensRepository;
let sendForgotPasswordEmailService: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakeUserTokensRepository = new FakeUserTokensRepository();

    sendForgotPasswordEmailService = new SendForgotPasswordEmailService(
      fakeUsersRepository,
      fakeMailProvider,
      fakeUserTokensRepository,
    );
  });

  it('Deve ser capaz de recuperar a senha usando o e-mail', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');

    await fakeUsersRepository.create({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    await sendForgotPasswordEmailService.Execute({
      email: 'danilo.salvador@smartlogic.com.br',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('Não deve permitir a recuperação de senha de um usuário inexistente', async () => {
    await expect(
      sendForgotPasswordEmailService.Execute({
        email: 'usuario@inexistente.com.br',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Deve permitir gerar o token de recuperação de senha', async () => {
    const generateToken = jest.spyOn(fakeUserTokensRepository, 'generate');

    const user = await fakeUsersRepository.create({
      name: 'Danilo Salvador',
      email: 'danilo.salvador@smartlogic.com.br',
      password: '123456',
    });

    await sendForgotPasswordEmailService.Execute({
      email: 'danilo.salvador@smartlogic.com.br',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });
});

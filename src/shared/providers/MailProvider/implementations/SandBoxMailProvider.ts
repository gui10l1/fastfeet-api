import { inject, injectable } from 'tsyringe';
import nodemailer, { Transporter } from 'nodemailer';

import IMailTemplateProvider from '@shared/providers/MailTemplateProvider/models/IMailTemplateProvider';

import IMailProviderDTO from '../dtos/IMailProviderDTO';
import IMailProvider from '../models/IMailProvider';

@injectable()
export default class SandBoxMailProvider implements IMailProvider {
  private mailTransporter: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    nodemailer.createTestAccount().then(testAccount => {
      this.mailTransporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    });
  }

  public async sendMail({
    from,
    to,
    subject,
    template,
  }: IMailProviderDTO): Promise<void> {
    const message = await this.mailTransporter.sendMail({
      from: {
        name: from?.name || 'Equipe FastFeet',
        address: from?.emailAddress || 'fastfeet@suport.com.br',
      },
      to: {
        address: to.emailAddress,
        name: to.name,
      },
      subject,
      html: await this.mailTemplateProvider.createTemplate(template),
    });

    console.log('Message sent: %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

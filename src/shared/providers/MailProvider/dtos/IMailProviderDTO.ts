import IMailTemplateProviderDTO from '@shared/providers/MailTemplateProvider/dtos/IMailTemplateProviderDTO';

interface IMailContact {
  name: string;
  emailAddress: string;
}

export default interface IMailProviderDTO {
  from?: IMailContact;
  to: IMailContact;
  subject: string;
  template: IMailTemplateProviderDTO;
}

import IMailProviderDTO from '../dtos/IMailProviderDTO';
import IMailProvider from '../models/IMailProvider';

export default class FakeMailProvider implements IMailProvider {
  private mails: Array<IMailProviderDTO> = [];

  public async sendMail(data: IMailProviderDTO): Promise<void> {
    this.mails.push(data);
  }
}

import IMailProviderDTO from '../dtos/IMailProviderDTO';

export default interface IMailProvider {
  sendMail(data: IMailProviderDTO): Promise<void>;
}

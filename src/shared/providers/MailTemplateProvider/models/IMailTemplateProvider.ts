import IMailTemplateProviderDTO from '../dtos/IMailTemplateProviderDTO';

export default interface IMailTemplateProvider {
  createTemplate(data: IMailTemplateProviderDTO): Promise<string>;
}

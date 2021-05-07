import IMailTemplateProviderDTO from '../dtos/IMailTemplateProviderDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class FakeMailTemplateProvider implements IMailTemplateProvider {
  public async createTemplate({
    templateFile,
  }: IMailTemplateProviderDTO): Promise<string> {
    return templateFile;
  }
}

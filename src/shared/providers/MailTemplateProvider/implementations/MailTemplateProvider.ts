import handlebars from 'handlebars';
import fs from 'fs';

import IMailTemplateProviderDTO from '../dtos/IMailTemplateProviderDTO';
import IMailTemplateProvider from '../models/IMailTemplateProvider';

export default class MailTemplateProvider implements IMailTemplateProvider {
  public async createTemplate({
    templateFile,
    variables,
  }: IMailTemplateProviderDTO): Promise<string> {
    const templateFileContent = await fs.promises.readFile(templateFile, {
      encoding: 'utf-8',
    });

    const handleBarsTemplate = handlebars.compile(templateFileContent);

    return handleBarsTemplate(variables);
  }
}

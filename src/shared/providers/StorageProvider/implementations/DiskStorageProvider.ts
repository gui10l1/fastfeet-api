import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/uploadConfig';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(filename: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.config.multer.tmpDirectory, filename),
      path.resolve(uploadConfig.config.multer.uploadDirectory),
    );

    return filename;
  }
}

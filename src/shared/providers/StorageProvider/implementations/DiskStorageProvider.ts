import path from 'path';
import fs from 'fs';

import uploadConfig from '@config/uploadConfig';
import IStorageProvider from '../models/IStorageProvider';

export default class DiskStorageProvider implements IStorageProvider {
  public async saveFile(filename: string): Promise<string> {
    await fs.promises.rename(
      path.resolve(uploadConfig.config.multer.tmpDirectory, filename),
      path.resolve(uploadConfig.config.multer.uploadDirectory, filename),
    );

    return filename;
  }

  public async saveFiles(files: string[]): Promise<string[]> {
    files.forEach(async file => {
      await fs.promises.rename(
        path.resolve(uploadConfig.config.multer.tmpDirectory, file),
        path.resolve(uploadConfig.config.multer.uploadDirectory, file),
      );
    });

    return files;
  }

  public async deleteFiles(files: string[]): Promise<void> {
    files.forEach(async file => {
      const filePath = path.resolve(
        uploadConfig.config.multer.uploadDirectory,
        file,
      );

      try {
        await fs.promises.stat(filePath);
      } catch {
        return;
      }

      await fs.promises.unlink(filePath);
    });
  }
}

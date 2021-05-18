import path from 'path';
import multer from 'multer';

interface IUploadConfig {
  type: 'disk';
  config: {
    multer: {
      tmpDirectory: string;
      uploadDirectory: string;
      storage: multer.StorageEngine;
    };
  };
}

const tmpDirectory = path.resolve(__dirname, '..', '..', 'temp');

export default {
  type: process.env.STORAGE_PROVIDER,
  config: {
    multer: {
      uploadDirectory: path.resolve(tmpDirectory, 'uploads'),
      tmpDirectory,
      storage: multer.diskStorage({
        destination: path.resolve(tmpDirectory),
        filename: (_, file, cb) => {
          const fileName = `${Date.now()}-${file.originalname}`;

          return cb(null, fileName);
        },
      }),
    },
  },
} as IUploadConfig;

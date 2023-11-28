import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';

import config from '../../config';

@Injectable()
export class FileStorageService {
  bucket = new Storage({ keyFilename: config.constants.GOOGLE_CLOUD_STORAGE_PATH }).bucket(
    config.env.GOOGLE_STORAGE_BUCKET_NAME,
  );

  async savePhoto(filename: string, photo: Buffer): Promise<void> {
    await this.bucket.file(filename).save(photo);
  }

  async getFile(filename: string): Promise<string> {
    const res = await this.bucket.file(filename).download();
    return res.toString();
  }

  async deletePhoto(filename: string): Promise<void> {
    await this.bucket.file(filename).delete();
  }
}

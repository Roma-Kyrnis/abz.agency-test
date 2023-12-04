import { Injectable } from '@nestjs/common';
import { Storage } from '@google-cloud/storage';
import { Stream } from 'node:stream';

import config from '../../config';

@Injectable()
export class FileStorageService {
  bucket = new Storage({
    keyFilename: config.createGoogleStorageCredentialsFile.keyFilename,
  }).bucket(config.env.GOOGLE_STORAGE_BUCKET_NAME);

  async savePhoto(filename: string, photo: Buffer): Promise<void> {
    await this.bucket.file(filename).save(photo);
  }

  async getFile(filename: string): Promise<Stream> {
    const res = this.bucket.file(filename).createReadStream();
    return res;
  }

  async deletePhoto(filename: string): Promise<void> {
    await this.bucket.file(filename).delete();
  }
}

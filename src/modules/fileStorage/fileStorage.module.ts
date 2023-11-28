import { Module } from '@nestjs/common';

import { FileStorageService } from './fileStorage.service';

@Module({
  exports: [FileStorageService],
  providers: [FileStorageService],
})
export class FileStorageModule {}

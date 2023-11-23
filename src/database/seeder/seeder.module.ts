import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dbConfig } from '../../config';
import { SeederService } from './seeder.service';
import { PositionsModule } from '../../modules/positions/positions.module';
import { PositionsService } from '../../modules/positions/positions.service';

@Module({
  imports: [PositionsModule, TypeOrmModule.forRoot(dbConfig)],
  providers: [SeederService, PositionsService],
})
export class SeederModule {}

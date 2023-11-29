import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { dbConfig } from '../../config';
import { SeederService } from './seeder.service';
import { PositionsModule } from '../../modules/positions/positions.module';
import { PositionsService } from '../../modules/positions/positions.service';
import { UsersModule } from '../../modules/users/users.module';
import { UsersService } from '../../modules/users/users.service';

@Module({
  imports: [PositionsModule, UsersModule, TypeOrmModule.forRoot(dbConfig)],
  providers: [SeederService, PositionsService, UsersService],
})
export class SeederModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Position } from './position.entity';
import { PositionsService } from './positions.service';

@Module({
  imports: [TypeOrmModule.forFeature([Position])],
  exports: [TypeOrmModule],
  providers: [PositionsService]
})
export class PositionsModule {}

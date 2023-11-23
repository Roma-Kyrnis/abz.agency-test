import { Module } from '@nestjs/common';

import { PositionsController } from './positions.controller';
import { PositionsHttpService } from './positions-http.service';
import { PositionsModule } from './positions.module';
import { PositionsService } from './positions.service';

@Module({
  imports: [PositionsModule],
  controllers: [PositionsController],
  providers: [PositionsHttpService, PositionsService],
})
export class PositionsHttpModule {}

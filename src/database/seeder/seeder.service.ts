import { Injectable } from '@nestjs/common';

import { PositionsService } from '../../modules/positions/positions.service';
import { positions } from './data/positions';

@Injectable()
export class SeederService {
  constructor(private readonly positionService: PositionsService) {}

  async seed() {
    await this.positionService.createOrUpdatePositions(positions);
  }
}

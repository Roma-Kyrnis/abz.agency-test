import { Controller, Get } from '@nestjs/common';

import { PositionsHttpService } from './positions-http.service';

@Controller('positions')
export class PositionsController {
  constructor(private readonly positionsHttpService: PositionsHttpService) {}

  @Get()
  getUsersPositions() {
    return this.positionsHttpService.getUsersPositions();
  }
}

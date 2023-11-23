import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { PositionsService } from './positions.service';

@Injectable()
export class PositionsHttpService {
  constructor(private readonly positionsService: PositionsService) {}

  async getUsersPositions() {
    const res = await this.positionsService.findAll();
    if (res.length) {
      return { success: true, positions: res };
    }
    throw new UnprocessableEntityException({
      success: false,
      message: 'Positions not found',
    });
  }
}

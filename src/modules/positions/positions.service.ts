import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Position } from './position.entity';
import { CreatePositionDTO } from './dto/position.dto';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position)
    private positionsRepository: Repository<Position>,
  ) {}

  createOrUpdatePositions(positions: Position[]) {
    return this.positionsRepository.save(positions);
  }

  create(position: CreatePositionDTO): Promise<Position> {
    return this.positionsRepository.save(position);
  }

  findAll(): Promise<Position[]> {
    return this.positionsRepository.find();
  }
}

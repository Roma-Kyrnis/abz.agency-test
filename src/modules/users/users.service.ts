import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';

import { User } from './user.entity';
import { DBCreateUserDTO } from './dto/users.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   *
   * @param user with link to photo
   * @returns ID of created user
   */
  async create(user: DBCreateUserDTO): Promise<number> {
    const res = await this.usersRepository.insert(user);
    return res.identifiers[0].id;
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import config from '../../config';
import { User } from './user.entity';
import { DBGetAllUsersParamsDTO, GetAllUsersParamsResponse } from './dto/users.dto';

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
  async create(user: User): Promise<void> {
    await this.usersRepository.insert(user);
  }

  async createOrUpdateUsers(users: User[]): Promise<void> {
    await this.usersRepository.save(users);
  }

  /**
   *
   * @param params offset or page should exist
   * @returns users
   */
  async findAll(params: DBGetAllUsersParamsDTO): Promise<GetAllUsersParamsResponse> {
    const { page, offset, count } = params;
    let skip = offset !== undefined && offset >= 0 ? offset : ((page as any as number) - 1) * count;

    const [users, totalUsers] = await this.usersRepository.findAndCount({
      take: count,
      skip,
      order: { registration_timestamp: 'DESC' },
    });

    const totalPages = Math.ceil(totalUsers / count);
    const getAllUsersURL = `${config.env.SERVER_DOMAIN_ADDRESS}${config.constants.USERS.REQUEST_GET_ALL_PATH}`;
    let prevUrl = null;
    let nextUrl = null;

    if (offset !== undefined) {
      if (offset > 0) {
        prevUrl = `${getAllUsersURL}?offset=${offset > count ? offset - count : 0}&count=${count}`;
      }
      if (offset + count < totalUsers) {
        nextUrl = `${getAllUsersURL}?offset=${offset + count}&count=${count}`;
      }
    }

    if (page !== undefined) {
      if (page > 1) {
        prevUrl = `${getAllUsersURL}?page=${page - 1}&count=${count}`;
      }
      if (page < totalPages) {
        nextUrl = `${getAllUsersURL}?page=${page + 1}&count=${count}`;
      }
    }

    return {
      success: true,
      page: page,
      offset: offset,
      total_pages: totalPages,
      total_users: totalUsers,
      count: count,
      links: {
        next_url: nextUrl,
        prev_url: prevUrl,
      },
      users,
    };
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
}

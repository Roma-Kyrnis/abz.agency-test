import { ConflictException, Injectable, NotFoundException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/users.dto';

@Injectable()
export class UsersHttpService {
  constructor(private readonly usersService: UsersService) {}

  async createUser(requestUser: CreateUserDTO, photo: any) {
    const user = {...requestUser, photo: photo ?? 'photo'}
    try {
      const res = await this.usersService.create(user);
      return res;
    } catch (error) {
      throw new ConflictException({
        success: false,
        message: 'User with this phone or email already exist',
      });
    }
  }

  getAllUsers() {
    return this.usersService.findAll();
  }

  async getUserById(id: number) {
    const user = await this.usersService.findOne(id);
    if (user) {
      return user;
    }
    throw new NotFoundException({
      success: false,
      message: 'The user with the requested identifier does not exist',
      fails: { user_id: ['User not found'] },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { PositionsService } from '../../modules/positions/positions.service';
import { GetUserDTO } from '../../modules/users/dto/users.dto';
import { UsersService } from '../../modules/users/users.service';
import { positions } from './data/positions';
import { User } from 'src/modules/users/user.entity';

const USERS_COUNT = 45;

@Injectable()
export class SeederService {
  constructor(
    private readonly positionService: PositionsService,
    private readonly usersService: UsersService,
  ) {}

  async seed() {
    await this.positionService.createOrUpdatePositions(positions);
    await this.seedUsers();
  }

  private async seedUsers() {
    const { total_users, users: dbUsers } = await this.usersService.findAll({
      offset: 0,
      count: 100,
    });
    const createNumberOfUsers = total_users > USERS_COUNT ? 0 : USERS_COUNT - total_users;

    console.log(dbUsers);

    const users: User[] = [...dbUsers.map(this.convertGetUserDTOToUser)];
    for (let i = 0; i < createNumberOfUsers; ) {
      const fakeUser = this.makeFakeUser();
      const isUserExist = users.find(
        user =>
          user.id === fakeUser.id ||
          user.email === fakeUser.email ||
          user.name === fakeUser.name ||
          user.phone === fakeUser.phone,
      );

      console.log('fakerUser', fakeUser);
      console.log('isUserExist', isUserExist);
      console.log('i: ', i);

      if (!isUserExist) {
        users.push(fakeUser);
        i++;
      }
    }

    console.log('users', users.length);

    await this.usersService.createOrUpdateUsers(users);
  }

  private makeFakeUser(): User {
    const positionIds = positions.map(position => position.id - 1);
    const minPositionId = Math.min(...positionIds);
    const maxPositionId = Math.max(...positionIds);
    const positionOpt = { min: minPositionId, max: maxPositionId };

    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.internet.userName(),
      phone: `+380${faker.helpers.fromRegExp(/[0-9]{9}/)}`,
      photo: faker.image.avatar(),
      registration_timestamp: faker.date.past(),
      position: positions[faker.number.int(positionOpt)],
    };
  }

  private convertGetUserDTOToUser(user: GetUserDTO): User {
    const { id, name, email, phone, photo, position, position_id, registration_timestamp } = user;
    return {
      id,
      name,
      email,
      phone,
      photo,
      registration_timestamp: new Date(registration_timestamp),
      position: { id: position_id, name: position },
    };
  }
}

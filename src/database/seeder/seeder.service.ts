import { Injectable } from '@nestjs/common';
import { faker } from '@faker-js/faker';

import { PositionsService } from '../../modules/positions/positions.service';
import { DBCreateUserDTO } from '../../modules/users/dto/users.dto';
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
    /** TODO: check how many users exist in database, create number of users to achieve goal */
    const { total_users, users: dbUsers } = await this.usersService.findAll({
      offset: 0,
      count: 100,
    });
    const createNumberOfUsers = total_users > USERS_COUNT ? 0 : USERS_COUNT - total_users;

    /** TODO: count min positions id and max id */
    const positionIds = positions.map(position => position.id);
    const minPositionId = Math.min(...positionIds);
    const maxPositionId = Math.max(...positionIds);

    console.log(dbUsers);

    const users: User[] = [...dbUsers];
    for (let i = 0; i < createNumberOfUsers; ) {
      const fakeUser = this.makeFakeUser({ min: minPositionId, max: maxPositionId });
      /** TODO: check if user is not exist. Create array and check if user exist with same */
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
        users.push({ ...fakeUser, position: positions[fakeUser.position_id] });
        i++;
      }
    }

    console.log('users', users.length);

    await this.usersService.createOrUpdateUsers(users);
  }

  private makeFakeUser(position: { min: number; max: number }): DBCreateUserDTO {
    return {
      id: faker.string.uuid(),
      email: faker.internet.email(),
      name: faker.internet.userName(),
      phone: `+380${faker.helpers.fromRegExp(/[0-9]{9}/)}`,
      photo: faker.image.avatar(),
      registration_timestamp: faker.date.past().getTime(),
      position_id: faker.number.int(position),
    };
  }
}

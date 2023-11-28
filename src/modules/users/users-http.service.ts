import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import { v4 as uuidV4 } from 'uuid';

import config from '../../config';
import { UsersService } from './users.service';
import { CreateUserDTO, DBCreateUserDTO } from './dto/users.dto';
import { FileStorageService } from '../fileStorage/fileStorage.service';
import { User } from './user.entity';

@Injectable()
export class UsersHttpService {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileStorageService: FileStorageService,
  ) {}

  async createUser(
    requestUser: CreateUserDTO,
    photo: Express.Multer.File,
  ): Promise<DBCreateUserDTO> {
    const userId = uuidV4();
    const photoName = `${this.get6DigitMD5(userId)}-${userId}`;
    try {
      await this.fileStorageService.savePhoto(photoName, photo.buffer);
    } catch (error) {
      console.log(error);

      throw new ConflictException(
        {
          success: false,
          message: 'Validation failed',
          fails: {
            photo: [
              'Invalid photo. Please try again, upload a new photo. Photo should be jpg/jpeg image, with resolution at least 70x70px and size must not exceed 5MB.',
            ],
          },
        },
        { cause: error },
      );
    }

    const photoUrl = `${config.env.SERVER_DOMAIN_ADDRESS}${config.constants.PHOTO.DOWNLOAD_URL_PATH}/${photoName}`;
    const user: DBCreateUserDTO = {
      ...requestUser,
      position_id: parseInt(requestUser.position_id, 10),
      registration_timestamp: Date.now(),
      id: userId,
      photo: photoUrl,
    };
    try {
      await this.usersService.create(user);
      return user;
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

  async getUserById(id: string): Promise<User> {
    try {
      const user = await this.usersService.findOne(id);
      if (user) {
        return user;
      }
      throw new NotFoundException({
        success: false,
        message: 'The user with the requested identifier does not exist',
        fails: { user_id: ['User not found'] },
      });
    } catch (error) {
      throw new BadRequestException({ success: false, message: 'User not found' });
    }
  }

  async getUsersAvatar(filename: string): Promise<any> {
    try {
      const res = await this.fileStorageService.getFile(filename);
      if (!res) {
        throw new Error(`Could not get avatar from ${filename}`);
      }
      return { success: true, buffer: res };
    } catch (error) {
      throw new NotFoundException({
        success: false,
        message: 'The users avatar does not exist',
        fails: { avatar: ['Users avatar not found'] },
      });
    }
  }

  private get6DigitMD5(name: string): string {
    return createHash('md5').update(name).digest('hex').slice(0, 6);
  }
}

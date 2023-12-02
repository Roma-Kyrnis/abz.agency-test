import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import { v4 as uuidV4 } from 'uuid';

import config from '../../config';
import { UsersService } from './users.service';
import {
  CreateUserDTO,
  CreateUserResponseDTO,
  DBGetAllUsersParamsDTO,
  GetAllUsersParamsDTO,
  GetAllUsersParamsResponse,
  GetUserDTO,
} from './dto/users.dto';
import { FileStorageService } from '../fileStorage/fileStorage.service';
import { PositionsService } from '../positions/positions.service';
import { User } from './user.entity';

@Injectable()
export class UsersHttpService {
  constructor(
    private readonly usersService: UsersService,
    private readonly fileStorageService: FileStorageService,
    private readonly positionsService: PositionsService,
  ) {}

  async createUser(
    requestUser: CreateUserDTO,
    photo: Express.Multer.File,
  ): Promise<CreateUserResponseDTO> {
    const userId = uuidV4();
    const photoName = `${this.get6DigitMD5(userId)}-${userId}.${
      config.constants.PHOTO.AVATAR_FORMAT
    }`;
    try {
      await this.fileStorageService.savePhoto(photoName, photo.buffer);
    } catch (error) {
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
    const positionId = parseInt(requestUser.position_id, 10);
    const position = await this.positionsService.findOne(positionId);

    if (!position) {
      throw new UnprocessableEntityException(
        {
          success: false,
          message: 'Validation failed',
          fails: {
            position_id: ['Position ID must be correct position_id and number bigger than 0.'],
          },
        },
        { cause: new NotFoundException() },
      );
    }

    const user: User = {
      ...requestUser,
      position,
      registration_timestamp: new Date(),
      id: userId,
      photo: photoUrl,
    };
    try {
      await this.usersService.create(user);
      return {
        success: true,
        message: 'New user created successfully registered',
        user_id: user.id,
      };
    } catch (error) {
      throw new ConflictException(
        {
          success: false,
          message: 'User with this phone or email already exist',
        },
        { cause: error },
      );
    }
  }

  getAllUsers(params: GetAllUsersParamsDTO): Promise<GetAllUsersParamsResponse> {
    const parsedParams: DBGetAllUsersParamsDTO = {
      count: parseInt(params.count, 10),
    };
    if (params.offset) parsedParams.offset = parseInt(params.offset, 10);
    if (params.page) parsedParams.page = parseInt(params.page, 10);

    return this.usersService.findAll(parsedParams);
  }

  async getUserById(id: string): Promise<GetUserDTO> {
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
      throw new BadRequestException(
        { success: false, message: 'User not found' },
        { cause: error },
      );
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
      throw new NotFoundException(
        {
          success: false,
          message: 'The users avatar does not exist',
          fails: { avatar: ['Users avatar not found'] },
        },
        { cause: error },
      );
    }
  }

  private get6DigitMD5(name: string): string {
    return createHash('md5').update(name).digest('hex').slice(0, 6);
  }
}

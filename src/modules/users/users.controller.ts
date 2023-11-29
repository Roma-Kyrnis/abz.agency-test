import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  HttpException,
  HttpStatus,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '../auth/auth.guard';
import config from '../../config';
import { UsersHttpService } from './users-http.service';
import {
  CreateUserDTO,
  CreateUserSchema,
  GetAllUsersParamsDTO,
  GetAllUsersParamsResponse,
  GetAllUsersParamsSchema,
  GetUserDTO,
  GetUsersAvatarDTO,
} from './dto/users.dto';
import { ZodValidationPipe } from '../../pipes/zodValidationPipe/zodValidation.pipe';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersHttpService: UsersHttpService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  createUser(
    @Body(new ZodValidationPipe(CreateUserSchema, 422)) user: CreateUserDTO,
    @UploadedFile() // @UploadedFile(
    photo //   new ParseFilePipe({
    //     errorHttpStatusCode: 422,
    //     fileIsRequired: true,
    //     exceptionFactory: (error: string) => {
    //       console.log('photo error', error);

    //       let messages = [];
    //       if (error.includes('size')) messages.push('The photo may not be greater than 5 Mbytes.');
    //       if (error.includes('type')) messages.push('The photo must be JPEG or JPG types');

    //       return { success: false, fails: { photo: messages } };
    //     },
    //     validators: [
    //       new MaxFileSizeValidator({ maxSize: config.constants.PHOTO.MAX_SIZE }),
    //       new FileTypeValidator({ fileType: config.constants.PHOTO.ALLOWED_TYPES_REGEXP }),
    //     ],
    //   }),
    // )
    : Express.Multer.File,
  ) {
    return this.usersHttpService.createUser(user, photo);
  }

  @Get()
  getAllUsers(
    @Query(new ZodValidationPipe(GetAllUsersParamsSchema, 422)) params: GetAllUsersParamsDTO,
  ): Promise<GetAllUsersParamsResponse> {
    return this.usersHttpService.getAllUsers(params);
  }

  @Get(':id')
  getUserById(@Param() { id }: GetUserDTO): Promise<User> {
    return this.usersHttpService.getUserById(id);
  }

  @Get('avatar/:filename')
  getUsersAvatar(@Param() { filename }: GetUsersAvatarDTO): Promise<string> {
    return this.usersHttpService.getUsersAvatar(filename);
  }
}

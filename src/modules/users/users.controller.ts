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
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '../auth/auth.guard';
import config from '../../config';
import { UsersHttpService } from './users-http.service';
import { CreateUserDTO, CreateUserSchema, GetUserDTO, GetUserSchema } from './dto/users.dto';
import { ZodValidationPipe } from '../../pipes/zodValidationPipe/zodValidation.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersHttpService: UsersHttpService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  createUser(
    @Body(new ZodValidationPipe(CreateUserSchema, 422)) user: CreateUserDTO,
    // @UploadedFile(
    //   new ParseFilePipe({
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
    // photo: Express.Multer.File,
  ) {
    // console.log(user);
    // console.log(photo);

    return this.usersHttpService.createUser(user, user.photo);
  }

  @Get()
  getAllUsers() {
    return this.usersHttpService.getAllUsers();
  }

  @Get(':id')
  @UsePipes(new ZodValidationPipe(GetUserSchema, 400))
  getUserById(@Param() { id }: GetUserDTO) {
    const idNumber = parseInt(id, 10);
    if (!Number.isNaN(idNumber)) {
      return this.usersHttpService.getUserById(idNumber);
    }
    return new HttpException('The user_id must be an integer.', HttpStatus.BAD_REQUEST);
  }
}

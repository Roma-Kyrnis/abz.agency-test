import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { AuthGuard } from '../auth/auth.guard';
import { UsersHttpService } from './users-http.service';
import {
  CreateUserDTO,
  UserSchema,
  GetAllUsersParamsDTO,
  GetAllUsersParamsResponse,
  GetAllUsersParamsSchema,
  GetUserDTO,
  GetUserParamDTO,
  GetUsersAvatarDTO,
} from './dto/users.dto';
import { ZodValidationPipe } from '../../pipes/zodValidation.pipe';
import { PhotoValidationPipe } from '../../pipes/photoValidation.pipe';
import { PhotoOptimizationPipe } from '../../pipes/photoOptimization.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersHttpService: UsersHttpService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  createUser(
    @Body(new ZodValidationPipe(UserSchema, 422)) user: CreateUserDTO,
    @UploadedFile(PhotoValidationPipe, PhotoOptimizationPipe)
    photo: Express.Multer.File,
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
  getUserById(@Param() { id }: GetUserParamDTO): Promise<GetUserDTO> {
    return this.usersHttpService.getUserById(id);
  }

  @Get('avatar/:filename')
  getUsersAvatar(@Param() { filename }: GetUsersAvatarDTO): Promise<string> {
    return this.usersHttpService.getUsersAvatar(filename);
  }
}

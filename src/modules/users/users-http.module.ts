import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersController } from './users.controller';
import { UsersHttpService } from './users-http.service';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { FileStorageModule } from '../fileStorage/fileStorage.module';
import { AuthHttpModule } from '../auth/auth-http.module';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { PositionsModule } from '../positions/positions.module';
import { PositionsService } from '../positions/positions.service';

@Module({
  imports: [UsersModule, FileStorageModule, AuthHttpModule, AuthModule, PositionsModule],
  controllers: [UsersController],
  providers: [UsersHttpService, UsersService, AuthService, JwtService, PositionsService],
})
export class UsersHttpModule {}

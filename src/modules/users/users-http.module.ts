import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersHttpService } from './users-http.service';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';

@Module({
  imports: [UsersModule],
  controllers: [UsersController],
  providers: [UsersHttpService, UsersService],
})
export class UsersHttpModule {}

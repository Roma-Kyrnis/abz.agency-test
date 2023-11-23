import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Token } from './token.entity';
import { AuthService } from './auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([Token])],
  exports: [TypeOrmModule],
  providers: [AuthService]
})
export class AuthModule {}

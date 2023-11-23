import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthHttpService } from './auth-http.service';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import config from '../../config';

@Module({
  imports: [
    AuthModule,
    JwtModule.register({
      secret: config.env.JWT_SECRET,
      signOptions: { expiresIn: config.env.JWT_TOKEN_LIFE },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthHttpService, AuthService],
})
export class AuthHttpModule {}

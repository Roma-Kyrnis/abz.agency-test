import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthHttpModule } from './modules/auth/auth-http.module';
import config from './config';
import { UsersHttpModule } from './modules/users/users-http.module';
import { PositionsHttpModule } from './modules/positions/positions-http.module';
import { HttpExceptionFilter } from './filters/httpExceptionFilter/httpException.filter';

@Module({
  imports: [
    AuthHttpModule,
    UsersHttpModule,
    PositionsHttpModule,
    TypeOrmModule.forRoot(config.database),
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}

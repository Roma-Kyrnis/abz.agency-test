import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import config from './config';
import { HttpExceptionFilter } from './filters/httpExceptionFilter/httpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(
    `${config.constants.API.GLOBAL_PREFIX}/${config.constants.API.GLOBAL_VERSION}`,
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(config.env.PORT, config.env.HOST, () => {
    console.log(`Server running on HOST ${config.env.HOST} and PORT ${config.env.PORT}`);
  });
}
bootstrap();

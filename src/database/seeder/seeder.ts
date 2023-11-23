import { NestFactory } from '@nestjs/core';

import { SeederModule } from './seeder.module';
import { SeederService } from './seeder.service';

async function bootstrap() {
  let app;
  try {
    app = await NestFactory.createApplicationContext(SeederModule);

    const seeder = app.get(SeederService);
    await seeder.seed();
  } catch (error) {
    console.log('Error with seeder');
    console.log(error);
  } finally {
    app?.close();
  }
}

bootstrap();

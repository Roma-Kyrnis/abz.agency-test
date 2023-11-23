import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSourceOptions } from 'typeorm';

import config from './env.validation';

export const dbConfig: DataSourceOptions = {
  type: 'mysql',
  host: config.MYSQL_HOST,
  port: config.MYSQL_PORT,
  database: config.MYSQL_DB,
  username: config.MYSQL_USER,
  password: config.MYSQL_PASSWORD,
  entities: [config.MYSQL_ENTITY],
  migrations: [config.MYSQL_MIGRATIONS],
  synchronize: config.MYSQL_SYNCHRONIZE,
};

export default {
  ...dbConfig,
  autoLoadEntities: true,
} as TypeOrmModuleOptions;

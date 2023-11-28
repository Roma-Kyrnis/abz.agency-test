import path from 'node:path';
import process from 'node:process';

import { plainToClass } from 'class-transformer';
import { IsBoolean, IsEnum, IsNumber, IsString, validateSync } from 'class-validator';
import * as dotenv from 'dotenv';

import constants from './constants.config';
import { Environment } from './interfaces/types.interface';

let { NODE_ENV: nodeENV } = process.env;

if (!Object.values(Environment).find(env => env === nodeENV)) {
  console.warn(`WARN: Default NODE_ENV is using - ${constants.DEFAULT_NODE_ENV}`);
  nodeENV = constants.DEFAULT_NODE_ENV;
}

dotenv.config({ path: path.resolve(process.cwd(), `.env.${nodeENV}`) });

class EnvironmentVariables {
  /** Environment */
  @IsEnum(Environment)
  NODE_ENV: Environment;

  /** Server */
  @IsNumber()
  PORT: number;

  @IsString()
  HOST: string;

  @IsString()
  SERVER_DOMAIN_ADDRESS: string;

  /** MySQL */
  @IsString()
  MYSQL_HOST: string;

  @IsNumber()
  MYSQL_PORT: number;

  @IsString()
  MYSQL_DB: string;

  @IsString()
  MYSQL_USER: string;

  @IsString()
  MYSQL_PASSWORD: string;

  @IsString()
  MYSQL_ENTITY: string;

  @IsString()
  MYSQL_MIGRATIONS: string;

  @IsBoolean()
  MYSQL_SYNCHRONIZE: boolean;

  /** JWT */
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_TOKEN_LIFE: string;

  /** Bcrypt */
  @IsNumber()
  BCRYPT_SALT_ROUNDS: number;

  /** Google Cloud Storage */
  @IsString()
  GOOGLE_STORAGE_BUCKET_NAME: string;
}

const validation = (): EnvironmentVariables => {
  const envConfig = {
    /** Environment */
    NODE_ENV: nodeENV,

    /** Server */
    PORT: parseInt(process.env.PORT ?? '', 10) || constants.DEFAULT_PORT,
    HOST: process.env.HOST ?? constants.DEFAULT_HOST,
    SERVER_DOMAIN_ADDRESS: process.env.SERVER_DOMAIN_ADDRESS,

    /** MySQL */
    MYSQL_HOST: process.env.MYSQL_HOST,
    MYSQL_PORT: process.env.MYSQL_PORT,
    MYSQL_DB: process.env.MYSQL_DB,
    MYSQL_USER: process.env.MYSQL_USER,
    MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    MYSQL_ENTITY: process.env.MYSQL_ENTITY,
    MYSQL_MIGRATIONS: process.env.MYSQL_MIGRATIONS,
    MYSQL_SYNCHRONIZE: nodeENV === Environment.Production ? false : process.env.MYSQL_SYNCHRONIZE,

    /** JWT */
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_TOKEN_LIFE: process.env.JWT_TOKEN_LIFE,

    /** Bcrypt */
    BCRYPT_SALT_ROUNDS: process.env.BCRYPT_SALT_ROUNDS,

    /** Google Cloud Storage */
    GOOGLE_STORAGE_BUCKET_NAME: process.env.GOOGLE_STORAGE_BUCKET_NAME,
  };

  try {
    const validatedConfig = plainToClass(EnvironmentVariables, envConfig, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export default validation();

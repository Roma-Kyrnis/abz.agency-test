import { Environment } from './interfaces/types.interface';

const photoAllowedTypes = ['jpg', 'jpeg'];
const photoAllowedTypesRegExp = new RegExp(
  `/^(${photoAllowedTypes.toString().replace(',', '|')})$/`,
);

export default {
  DEFAULT_NODE_ENV: Environment.Production,
  DEFAULT_PORT: 3000,
  DEFAULT_HOST: '::',

  PHOTO: {
    MIN_WIDTH: 70,
    MIN_HEIGHT: 70,
    MAX_SIZE: 5 * 1000 * 1000,
    ALLOWED_TYPES: photoAllowedTypes,
    ALLOWED_TYPES_REGEXP: photoAllowedTypesRegExp,
  },

  API: {
    GLOBAL_PREFIX: 'api',
    GLOBAL_VERSION: 'v1',
    ERRORS: {
      404: 'Page not found',
    },
  },

  AUTH: {
    TOKEN_PAYLOAD: 'token',
    TOKEN_HEADER: 'token',
  },
};

import { writeFileSync } from 'node:fs';
import path from 'node:path';

import constants from './constants.config';
import env from './env.validation';

const pathToFile = path.join(path.resolve(process.cwd()), constants.GOOGLE_CLOUD_STORAGE_PATH);

const write = () => {
  const credentials = Buffer.from(env.GOOGLE_STORAGE_CREDENTIALS_BASE64, 'base64').toString('utf8');

  writeFileSync(pathToFile, credentials);

  return { keyFilename: constants.GOOGLE_CLOUD_STORAGE_PATH };
};

export default write();

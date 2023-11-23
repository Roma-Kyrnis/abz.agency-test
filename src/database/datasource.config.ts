import { DataSource } from 'typeorm';

import { dbConfig } from '../config';

export default new DataSource({ ...dbConfig });

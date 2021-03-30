import path from 'path';

export const DIR_ROOT = process.cwd();

export const DIR_DB = path.join(DIR_ROOT, '/db');

export const DIR_TEMP = path.join(DIR_ROOT, '/temp');

export const DB_NAME = 'finances-storage.json';

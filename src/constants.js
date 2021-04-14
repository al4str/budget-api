import path from 'path';

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

/** @type {string} */
export const HOST = process.env.HOST;

/** @type {string} */
export const PORT = process.env.PORT;

export const DIR_ROOT = process.cwd();

export const DIR_VOLUME = path.join(DIR_ROOT, '/volume');

export const DIR_DB = path.join(DIR_VOLUME, '/db');

export const DIR_TEMP = path.join(DIR_VOLUME, '/temp');

export const DIR_UPLOADS = path.join(DIR_TEMP, '/uploads');

export const DIR_AVATARS = path.join(DIR_TEMP, '/avatars');

export const DB_NAME = 'storage.json';

import path from 'path';

/** @type {string} */
export const HOST = process.env.HOST || '0.0.0.0';

/** @type {number} */
export const PORT = parseInt(process.env.PORT) || 3000;

export const DIR_ROOT = process.cwd();

export const DIR_DB = path.join(DIR_ROOT, '/db');

export const DIR_TEMP = path.join(DIR_ROOT, '/temp');

export const DIR_UPLOADS = path.join(DIR_TEMP, '/uploads');

export const DIR_AVATARS = path.join(DIR_TEMP, '/avatars');

export const DB_NAME = 'finances-storage.json';

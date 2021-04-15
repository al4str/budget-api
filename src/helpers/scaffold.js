import path from 'path';
import fs from 'fs/promises';
import {
  DIR_DB,
  DIR_BACKUPS,
  DIR_UPLOADS,
  DIR_AVATARS,
  DB_NAME,
} from '@/constants';
import { dbInit } from '@/libs/db';
import { seedsPlant } from '@/seeds';

/**
 * @return {Promise<void>}
 * */
export async function scaffold() {
  await Promise.all([
    DIR_DB,
    DIR_BACKUPS,
    DIR_UPLOADS,
    DIR_AVATARS,
  ].map((dirPath) => createDirIfAbsent(dirPath)));
  const dbPath = path.join(DIR_DB, DB_NAME);
  try {
    await fs.stat(dbPath);
    dbInit();
  }
  catch (err) {
    await fs.writeFile(dbPath, JSON.stringify({}));
    dbInit();
    seedsPlant();
  }
}

/**
 * @param {string} dirPath
 * @return {Promise<void>}
 * */
async function createDirIfAbsent(dirPath) {
  try {
    await fs.stat(dirPath);
  }
  catch (err) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

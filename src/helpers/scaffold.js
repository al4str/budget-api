import path from 'path';
import fs from 'fs/promises';
import { DIR_TEMP, DIR_DB, DB_NAME } from '@/constants';
import { dbInit } from '@/libs/db';
import { seedsPlant } from '@/seeds';

/**
 * @return {Promise<void>}
 * */
export async function scaffold() {
  try {
    await fs.stat(DIR_TEMP);
  }
  catch (err) {
    await fs.mkdir(DIR_TEMP);
  }
  try {
    await fs.stat(DIR_DB);
  }
  catch (err) {
    await fs.mkdir(DIR_DB);
  }
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

import fs from 'fs';
import path from 'path';
import { dbSelect } from '@/libs/db';
import { datesUTCGetTimestamp } from '@/libs/dates';
import { DIR_BACKUPS } from '@/constants';

/**
 * @return {DBRoot}
 * */
export function backupGetRoot() {
  return dbSelect({
    selector(root) {
      return root;
    },
  });
}

/**
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: string
 * }>}
 * */
export function backupCreate() {
  return new Promise((resolve) => {
    const root = backupGetRoot();
    const rootString = JSON.stringify(root);
    const ts = datesUTCGetTimestamp();
    const filePath = path.join(DIR_BACKUPS, `backup.${ts}.json`);
    const stream = fs.createWriteStream(filePath);
    stream.on('error', (err) => resolve({
      ok: false,
      reason: err,
      data: '',
    }));
    stream.on('finish', () => resolve({
      ok: true,
      reason: null,
      data: rootString,
    }));
    stream.write(rootString, 'utf-8');
    stream.end();
  });
}

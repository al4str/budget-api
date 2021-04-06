import fs from 'fs';
import resizeImage from 'sharp';
import { ERRORS } from '@/helpers/errors';

/**
 * @param {Object} params
 * @param {UploadFile} params.file
 * @param {number} params.width
 * @param {number} params.height
 * @param {string} params.outPath
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|string
 * }>}
 * */
export async function resizeFile(params) {
  return new Promise((resolve) => {
    const { file, width, height, outPath } = params;
    if (!file || !file.uploadedPath || !width || !height || !outPath) {
      resolve({
        ok: false,
        reason: new Error(ERRORS.resizeInvalidParams),
        data: null,
      });
      return;
    }
    const resizer = resizeImage();
    const transformer = resizer.resize({
      width,
      height,
      fit: 'inside',
      background: {
        r: 255,
        g: 255,
        b: 255,
        alpha: 1,
      },
    });
    const readStream = fs.createReadStream(file.uploadedPath);
    const writeStream = fs.createWriteStream(outPath);
    readStream
      .on('error', (err) => {
        resolve({
          ok: false,
          reason: err,
          data: null,
        });
      })
      .on('end', () => {
        resolve({
          ok: true,
          reason: null,
          data: outPath,
        });
      })
      .pipe(transformer)
      .pipe(writeStream);
  });
}

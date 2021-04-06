import fs from 'fs/promises';
import formidable from 'formidable';
import { DIR_UPLOADS } from '@/constants';

const uploadParser = formidable({
  uploadDir: DIR_UPLOADS,
  keepExtensions: true,
  maxFileSize: 5 * 1024 * 1024,
});

/**
 * @typedef {Object} UploadFile
 * @property {string} uploadedPath
 * @property {string} originalFileName
 * @property {string} mimeType
 * @property {number} size
 * */

/**
 * @param {Request} req
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: {
 *     file: null|UploadFile
 *     body: Object
 *   }
 * }>}
 * */
export function uploadParse(req) {
  return new Promise((resolve => {
    uploadParser.parse(req, (err, fields, files) => {
      if (err) {
        resolve({
          ok: false,
          reason: err,
          data: {
            file: null,
            body: {},
          },
        });
        return;
      }
      resolve({
        ok: true,
        reason: null,
        data: {
          file: {
            uploadedPath: files.file.path,
            originalFileName: files.file.name,
            mimeType: files.file.type,
            size: files.file.size,
          },
          body: fields,
        },
      });
    });
  }));
}

/**
 * @param {UploadFile} file
 * @return {Promise<void>}
 * */
export async function uploadDelete(file) {
  try {
    await fs.unlink(file.uploadedPath);
  }
  catch (err) {
    //
  }
}

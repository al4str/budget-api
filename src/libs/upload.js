import path from 'path';
import formidable from 'formidable';
import { DIR_TEMP } from '@/constants';

const uploadParser = formidable({
  uploadDir: path.join(DIR_TEMP, 'uploads'),
  keepExtensions: true,
  maxFileSize: 100 * 1024 * 1024,
});

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
export function uploadParseData(req) {
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
 * @typedef {Object} UploadFile
 * @property {string} uploadedPath
 * @property {string} originalFileName
 * @property {string} mimeType
 * @property {number} size
 * */

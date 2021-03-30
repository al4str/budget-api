import slugify from 'slugify';
import sanitize from 'sanitize-filename';

/**
 * @param {string} raw
 * @return {string}
 * */
export function slugGet(raw) {
  return sanitize(slugify(raw, { replacement: ' ' }));
}

import { nanoid } from 'nanoid';

/**
 * @param {number} [size=21]
 * @return {string}
 * */
export function idGet(size = 21) {
  return nanoid(size);
}

/**
 * @param {string} id
 * @return {boolean}
 * */
export function idInvalid(id) {
  return !id
    || typeof id !== 'string'
    || !/[-a-z0-9_]/i.test(id);
}

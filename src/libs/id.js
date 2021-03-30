import { nanoid } from 'nanoid';

/**
 * @param {number} [size=21]
 * @return {string}
 * */
export function idGet(size = 21) {
  return nanoid(size);
}

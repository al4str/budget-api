import { dbDoesItemExist, dbGetItem, dbUpdate } from '@/libs/db';

/**
 * @typedef {Object} UsersItem
 * @property {string} name
 * @property {string} avatarURL
 * @property {string} pin
 * */

/**
 * @typedef {Object} UsersItemPublic
 * @property {string} id
 * @property {string} name
 * @property {string} avatarURL
 * */

/**
 * @typedef {Object} UsersItemFull
 * @property {string} id
 * @property {string} name
 * @property {string} avatarURL
 * @property {string} pin
 * */

/**
 * @param {string} id
 * @return {Promise<boolean>}
 * */
export async function usersExists(id) {
  try {
    return dbDoesItemExist({
      name: 'USERS',
      id,
    });
  }
  catch (err) {
    return false;
  }
}

/**
 * @param {Object} params
 * @param {string} params.id
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|UsersItem
 * }>}
 * */
export async function usersItem(params) {
  try {
    const { id } = params;
    const item = dbGetItem({
      name: 'USERS',
      id,
    });

    if (!item || item.meta.deleted) {
      return {
        ok: false,
        reason: new Error('Does not exist'),
        data: null,
      };
    }
    return {
      ok: true,
      reason: null,
      data: item.data,
    };
  }
  catch (err) {
    return {
      ok: false,
      reason: err,
      data: null,
    };
  }
}

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {Partial<UsersItem>} params.payload
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|UsersItem
 * }>}
 * */
export async function usersUpdate(params) {
  try {
    const {
      id,
      payload,
      byUserId,
    } = params;
    const item = dbUpdate({
      name: 'USERS',
      id,
      updater(prevItem) {
        return {
          ...prevItem,
          data: {
            ...prevItem.data,
            ...payload,
          },
        };
      },
      userId: byUserId,
    });
    /** @type {UsersItem} */
    const user = item.data;

    return {
      ok: true,
      reason: null,
      data: user,
    };
  }
  catch (err) {
    return {
      ok: false,
      reason: err,
      data: null,
    };
  }
}

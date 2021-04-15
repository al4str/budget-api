import {
  dbDoesItemExist,
  dbGetItem,
  dbGetItems,
  dbUpdate,
} from '@/libs/db';
import { ERRORS } from '@/helpers/errors';

/**
 * @typedef {Object} UsersItem
 * @property {string} name
 * @property {string} avatarId
 * @property {string} pin
 * */

/**
 * @typedef {Object} UsersItemPublic
 * @property {string} id
 * @property {string} name
 * @property {string} avatarId
 * */

/**
 * @typedef {Object} UsersItemFull
 * @property {string} id
 * @property {string} name
 * @property {string} avatarId
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
        reason: new Error(ERRORS.resourceNotExist),
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
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: Array<UsersItemPublic>
 * }>}
 * */
export async function usersList() {
  try {
    const items = dbGetItems({
      name: 'USERS',
    });

    return {
      ok: true,
      reason: null,
      data: items.map((item) => ({
        id: item.id,
        name: item.data.name,
        avatarId: item.data.avatarId,
      })),
    };
  }
  catch (err) {
    return {
      ok: false,
      reason: err,
      data: [],
    };
  }
}

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {Object} params.payload
 * @param {string} [params.payload.name]
 * @param {string} [params.payload.avatarId]
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
      updater(prevData) {
        return {
          ...prevData,
          ...payload,
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

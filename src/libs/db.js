import path from 'path';
import { JsonDB as DB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
import { datesUTCGetTimestamp } from '@/libs/dates';
import { IS_PRODUCTION, DIR_DB, DB_NAME } from '@/constants';
import { ERRORS } from '@/helpers/errors';

/**
 * @typedef {import('node-json-db').JsonDB} DBInstance
 * */

/** @type {DBInstance} */
let INSTANCE = null;

export const DB_SEED_USER_ID = 'SEED';

export const DB_NAMES = {
  USERS: 'USERS',
  SESSIONS: 'SESSIONS',
  CATEGORIES: 'CATEGORIES',
  COMMODITIES: 'COMMODITIES',
  INCOME: 'INCOME',
  EXPENSES: 'EXPENSES',
  EXPENDITURES: 'EXPENDITURES',
};

/**
 * @typedef {'USERS'|'SESSIONS'|'CATEGORIES'
 * |'COMMODITIES'|'INCOME'|'EXPENSES'|'EXPENDITURES'} DBName
 * */

/**
 * @typedef {Object} DBMeta
 * @property {DBName} name
 * @property {boolean} deleted
 * @property {DBMetaItem} metaCreate
 * @property {DBMetaItem} metaUpdate
 * @property {DBMetaItem} metaDelete
 * */

/**
 * @typedef {Object} DBMetaItem
 * @property {string} userId
 * @property {number} date
 * */

/**
 * @typedef {Object} DBItem
 * @property {string} id
 * @property {Object} data
 * @property {DBMeta} meta
 * */

/**
 * @typedef {Record<DBName, Record<string, DBItem>>} DBRoot
 * */

/**
 * @param {string} name
 * @return {void}
 * */
function validateName(name) {
  if (!(name in DB_NAMES)) {
    throw new Error(ERRORS.dbInvalidName);
  }
}

/**
 * @param {string} userId
 * @return {void}
 * */
function validateUser(userId) {
  if (userId === DB_SEED_USER_ID) {
    return;
  }
  const user = INSTANCE.getData(`/${DB_NAMES.USERS}/${userId}`);
  if (!user) {
    throw new Error(ERRORS.dbInvalidUser);
  }
}

/**
 * @return {void}
 * */
export function dbInit() {
  const dbPath = path.join(DIR_DB, DB_NAME);
  const dbConfig = new Config(
    dbPath,
    true,
    !IS_PRODUCTION,
    '/',
  );
  INSTANCE = new DB(dbConfig);
}

/**
 * @template T
 * @param {Object} params
 * @param {function(DBRoot): T} params.selector
 * @return {T}
 * */
export function dbSelect(params) {
  const { selector } = params;
  if (typeof selector !== 'function') {
    throw new Error(ERRORS.dbInvalidSelector);
  }
  const root = INSTANCE.getData('/');
  return selector(root);
}

/**
 * @param {Object} params
 * @param {DBName} params.name
 * @param {string} params.id
 * @return {boolean}
 * */
export function dbDoesItemExist(params) {
  const { name, id } = params;
  validateName(name);
  if (!id) {
    return false;
  }
  return INSTANCE.exists(`/${name}/${id}`);
}

/**
 * @param {Object} params
 * @param {DBName} params.name
 * @return {Array<DBItem>}
 * */
export function dbGetItems(params) {
  const { name } = params;
  validateName(name);
  const items = INSTANCE.getData(`/${name}`);
  return Object.values(items);
}

/**
 * @param {Object} params
 * @param {DBName} params.name
 * @param {string} params.id
 * @return {DBItem}
 * */
export function dbGetItem(params) {
  const { name, id } = params;
  validateName(name);
  return INSTANCE.getData(`/${name}/${id}`);
}

/**
 * @param {Object} params
 * @param {DBName} params.name
 * @param {string} params.id
 * @param {Object} params.data
 * @param {string} params.userId
 * @return {DBItem}
 * */
export function dbCreate(params) {
  const { name, id, data, userId } = params;
  validateName(name);
  validateUser(userId);
  const item = {
    id,
    data,
    meta: {
      name,
      deleted: false,
      metaCreate: {
        userId,
        date: datesUTCGetTimestamp(),
      },
      metaUpdate: {
        userId: '',
        date: 0,
      },
      metaDelete: {
        userId: '',
        date: 0,
      },
    },
  };
  INSTANCE.push(`/${name}/${id}`, item);
  return item;
}

/**
 * @param {Object} params
 * @param {DBName} params.name
 * @param {string} params.id
 * @param {function(Object): Object} params.updater
 * @param {string} params.userId
 * @return {DBItem}
 * */
export function dbUpdate(params) {
  const { name, id, updater, userId } = params;
  validateName(name);
  validateUser(userId);
  /** @type {DBItem} */
  const prevItem = INSTANCE.getData(`/${name}/${id}`);
  const nextData = updater(prevItem.data);
  /** @type {DBItem} */
  const nextItem = {
    ...prevItem,
    data: nextData,
    meta: {
      ...prevItem.meta,
      metaUpdate: {
        userId,
        date: datesUTCGetTimestamp(),
      },
    },
  };
  INSTANCE.push(`/${name}/${id}`, nextItem);
  return nextItem;
}

/**
 * @param {Object} params
 * @param {DBName} params.name
 * @param {string} params.id
 * @param {string} params.userId
 * @return {DBItem}
 * */
export function dbDelete(params) {
  const { name, id, userId } = params;
  validateName(name);
  validateUser(userId);
  const prevItem = INSTANCE.getData(`/${name}/${id}`);
  /** @type {DBItem} */
  const nextItem = {
    ...prevItem,
    meta: {
      ...prevItem.meta,
      deleted: true,
      metaDelete: {
        userId,
        date: datesUTCGetTimestamp(),
      },
    },
  };
  INSTANCE.push(`/${name}/${id}`, nextItem);
  return nextItem;
}

/**
 * @param {Object} params
 * @param {DBName} params.name
 * @param {string} params.id
 * @return {void}
 * */
export function dbWipe(params) {
  const { name, id } = params;
  validateName(name);
  INSTANCE.delete(`/${name}/${id}`);
}

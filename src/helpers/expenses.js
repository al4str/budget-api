import { datesValidate } from '@/libs/dates';
import { sumValidate } from '@/libs/sum';
import { genericOperations } from '@/helpers/genericOperations';
import { usersExists } from '@/helpers/users';
import { categoriesExists } from '@/helpers/categories';

/**
 * @typedef {Object} ExpensesItem
 * @property {string} userId
 * @property {string} categoryId
 * @property {number} date
 * @property {number} sum
 * @property {string} comment
 * */

/**
 * @typedef {Object} ExpensesItemPublic
 * @property {string} id
 * @property {string} userId
 * @property {string} categoryId
 * @property {number} date
 * @property {number} sum
 * @property {string} comment
 * */

const {
  createItem,
  readItem,
  updateItem,
  deleteItem,
  listItems,
  existItem,
} = genericOperations('EXPENSES');

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {ExpensesItem} params.payload
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|ExpensesItem
 * }>}
 * */
export const expensesCreate = createItem;

/**
 * @param {Object} params
 * @param {string} params.id
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|ExpensesItem
 * }>}
 * */
export const expensesRead = readItem;

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {Partial<ExpensesItem>} params.payload
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|ExpensesItem
 * }>}
 * */
export const expensesUpdate = updateItem;

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|ExpensesItem
 * }>}
 * */
export const expensesDelete = deleteItem;

/**
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: Array<ExpensesItemPublic>
 * }>}
 * */
export const expensesList = listItems;

/**
 * @param {string} id
 * @return {Promise<boolean>}
 * */
export const expensesExists = existItem;

/**
 * @param {Object} payload
 * @param {string} payload.userId
 * @param {string} payload.categoryId
 * @param {string} payload.date
 * @param {number} payload.sum
 * @param {string} payload.comment
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 * }>}
 * */
export async function expensesValidateCreate(payload) {
  const {
    userId,
    categoryId,
    date,
    sum,
  } = payload;
  if (!await usersExists(userId)) {
    return {
      ok: false,
      reason: new Error('User does not exist'),
    };
  }
  if (!await categoriesExists(categoryId)) {
    return {
      ok: false,
      reason: new Error('Category does not exist'),
    };
  }
  if (!datesValidate(date)) {
    return {
      ok: false,
      reason: new Error('Invalid date'),
    };
  }
  if (!sumValidate(sum)) {
    return {
      ok: false,
      reason: new Error('Invalid sum'),
    };
  }
  return {
    ok: true,
    reason: null,
  }
}

/**
 * @param {Object} payload
 * @param {string} payload.userId
 * @param {string} payload.categoryId
 * @param {string} payload.date
 * @param {number} payload.sum
 * @param {string} payload.comment
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 * }>}
 * */
export async function expensesValidateUpdate(payload) {
  const {
    userId,
    categoryId,
    date,
    sum,
  } = payload;
  if (typeof userId !== 'undefined' && !await usersExists(userId)) {
    return {
      ok: false,
      reason: new Error('User does not exist'),
    };
  }
  if (typeof categoryId !== 'undefined' && !await categoriesExists(categoryId)) {
    return {
      ok: false,
      reason: new Error('Category does not exist'),
    };
  }
  if (typeof date !== 'undefined' && !datesValidate(date)) {
    return {
      ok: false,
      reason: new Error('Invalid date'),
    };
  }
  if (typeof sum !== 'undefined' && !sumValidate(sum)) {
    return {
      ok: false,
      reason: new Error('Invalid sum'),
    };
  }
  return {
    ok: true,
    reason: null,
  }
}

/**
 * @param {string} id
 * @param {ExpensesItem} data
 * @return {ExpensesItemPublic}
 * */
export function expensesMapPublic(id, data) {
  return {
    id,
    userId: data.userId,
    categoryId: data.categoryId,
    date: data.date,
    sum: data.sum,
    comment: data.comment,
  };
}

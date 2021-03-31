import { genericOperations } from '@/helpers/genericOperations';
import { expensesExists } from '@/helpers/expenses';
import { commoditiesExists } from '@/helpers/commodities';

/**
 * @typedef {Object} ExpendituresItem
 * @property {string} expenseId
 * @property {string} commodityId
 * @property {number} amount
 * @property {boolean} essential
 * */

/**
 * @typedef {Object} ExpendituresItemPublic
 * @property {string} id
 * @property {string} expenseId
 * @property {string} commodityId
 * @property {number} amount
 * @property {boolean} essential
 * */

const {
  createItem,
  readItem,
  updateItem,
  deleteItem,
  listItems,
  existItem,
} = genericOperations('EXPENDITURES');

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {ExpendituresItem} params.payload
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|ExpendituresItem
 * }>}
 * */
export const expendituresCreate = createItem;

/**
 * @param {Object} params
 * @param {string} params.id
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|ExpendituresItem
 * }>}
 * */
export const expendituresRead = readItem;

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {Partial<ExpendituresItem>} params.payload
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|ExpendituresItem
 * }>}
 * */
export const expendituresUpdate = updateItem;

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|ExpendituresItem
 * }>}
 * */
export const expendituresDelete = deleteItem;

/**
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: Array<ExpendituresItemPublic>
 * }>}
 * */
export const expendituresList = listItems;

/**
 * @param {string} id
 * @return {Promise<boolean>}
 * */
export const expendituresExists = existItem;

/**
 * @param {Object} payload
 * @param {string} payload.expenseId
 * @param {string} payload.commodityId
 * @param {string} payload.amount
 * @param {number} payload.essential
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 * }>}
 * */
export async function expendituresValidateCreate(payload) {
  const {
    expenseId,
    commodityId,
  } = payload;
  if (!await expensesExists(expenseId)) {
    return {
      ok: false,
      reason: new Error('Expense does not exist'),
    };
  }
  if (!await commoditiesExists(commodityId)) {
    return {
      ok: false,
      reason: new Error('Commodity does not exist'),
    };
  }
  return {
    ok: true,
    reason: null,
  }
}

/**
 * @param {Object} payload
 * @param {string} payload.expenseId
 * @param {string} payload.commodityId
 * @param {string} payload.amount
 * @param {number} payload.essential
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 * }>}
 * */
export async function expendituresValidateUpdate(payload) {
  const {
    expenseId,
    commodityId,
  } = payload;
  if (typeof expenseId !== 'undefined' && !await expensesExists(expenseId)) {
    return {
      ok: false,
      reason: new Error('Expense does not exist'),
    };
  }
  if (typeof commodityId !== 'undefined' && !await commoditiesExists(commodityId)) {
    return {
      ok: false,
      reason: new Error('Commodity does not exist'),
    };
  }
  return {
    ok: true,
    reason: null,
  }
}

/**
 * @param {string} id
 * @param {ExpendituresItem} data
 * @return {ExpendituresItemPublic}
 * */
export function expendituresMapPublic(id, data) {
  return {
    id,
    expenseId: data.expenseId,
    commodityId: data.commodityId,
    amount: data.amount,
    essential: data.essential,
  };
}

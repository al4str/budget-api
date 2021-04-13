import { idInvalid } from '@/libs/id';
import { ERRORS } from '@/helpers/errors';
import { resourceOperationsCreate } from '@/helpers/resourceOperations';
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

const basicOperations = resourceOperationsCreate('EXPENDITURES');

export const expendituresExists = basicOperations.exist;

/**
 * @param {string} id
 * @param {ExpendituresItem} data
 * @return {ExpendituresItemPublic}
 * */
function publicMapper(id, data) {
  return {
    id,
    expenseId: data.expenseId,
    commodityId: data.commodityId,
    amount: data.amount,
    essential: data.essential,
  };
}

/**
 * @param {Object} payload
 * @param {string} payload.id
 * @param {string} payload.expenseId
 * @param {string} payload.commodityId
 * @param {string} payload.amount
 * @param {number} payload.essential
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 * }>}
 * */
async function createValidator(payload) {
  const {
    id,
    expenseId,
    commodityId,
  } = payload;
  if (idInvalid(id)) {
    return {
      ok: false,
      reason: new Error(ERRORS.expendituresInvalidId),
    };
  }
  if (!await expensesExists(expenseId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.expendituresInvalidExpense),
    };
  }
  if (!await commoditiesExists(commodityId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.expendituresInvalidCommodity),
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
async function updateValidator(payload) {
  const {
    expenseId,
    commodityId,
  } = payload;
  if (typeof expenseId !== 'undefined' && !await expensesExists(expenseId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.expendituresInvalidExpense),
    };
  }
  if (typeof commodityId !== 'undefined' && !await commoditiesExists(commodityId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.expendituresInvalidCommodity),
    };
  }
  return {
    ok: true,
    reason: null,
  }
}

export const expendituresOperations = {
  ...basicOperations,
  publicMapper,
  createValidator,
  updateValidator,
};

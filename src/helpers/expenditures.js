import { idInvalid } from '@/libs/id';
import { ERRORS } from '@/helpers/errors';
import { resourceOperationsCreate } from '@/helpers/resourceOperations';
import { transactionsExist } from '@/helpers/transactions';
import { commoditiesExists } from '@/helpers/commodities';

/**
 * @typedef {Object} ExpendituresItem
 * @property {string} transactionId
 * @property {string} commodityId
 * @property {number} amount
 * @property {boolean} essential
 * */

/**
 * @typedef {Object} ExpendituresItemPublic
 * @property {string} id
 * @property {string} transactionId
 * @property {string} commodityId
 * @property {number} amount
 * @property {boolean} essential
 * */

const basicOperations = resourceOperationsCreate('EXPENDITURES');

/**
 * @param {string} id
 * @param {ExpendituresItem} data
 * @return {ExpendituresItemPublic}
 * */
function publicMapper(id, data) {
  return {
    id,
    transactionId: data.transactionId,
    commodityId: data.commodityId,
    amount: data.amount,
    essential: data.essential,
  };
}

/**
 * @param {Object} payload
 * @param {string} payload.id
 * @param {string} payload.transactionId
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
    transactionId,
    commodityId,
  } = payload;
  if (idInvalid(id)) {
    return {
      ok: false,
      reason: new Error(ERRORS.expendituresInvalidId),
    };
  }
  if (!await transactionsExist(transactionId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.expendituresInvalidTransaction),
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
 * @param {string} payload.transactionId
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
    transactionId,
    commodityId,
  } = payload;
  if (typeof transactionId !== 'undefined'
    && !await transactionsExist(transactionId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.expendituresInvalidTransaction),
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

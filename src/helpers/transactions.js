import { idInvalid } from '@/libs/id';
import { datesValidate } from '@/libs/dates';
import { sumValidate } from '@/libs/sum';
import { ERRORS } from '@/helpers/errors';
import { resourceOperationsCreate } from '@/helpers/resourceOperations';
import { usersExists } from '@/helpers/users';
import { categoriesExists } from '@/helpers/categories';
import { expendituresValidator } from '@/helpers/expenditures';

/**
 * @typedef {'income'|'expense'} TransactionType
 * */

/**
 * @typedef {Object} TransactionItem
 * @property {TransactionType} type
 * @property {string} userId
 * @property {string} categoryId
 * @property {string} date
 * @property {number} sum
 * @property {string} comment
 * @property {Array<ExpenditureItem>} expenditures
 * */

/**
 * @typedef {Object} TransactionItemPublic
 * @property {TransactionType} type
 * @property {string} id
 * @property {string} userId
 * @property {string} categoryId
 * @property {string} date
 * @property {number} sum
 * @property {Array<ExpenditureItem>} expenditures
 * */

const basicOperations = resourceOperationsCreate('TRANSACTIONS');

/**
 * @param {string} id
 * @param {TransactionItem} data
 * @return {TransactionItemPublic}
 * */
function publicMapper(id, data) {
  return {
    type: data.type,
    id,
    userId: data.userId,
    categoryId: data.categoryId,
    date: data.date,
    sum: data.sum,
    comment: data.comment,
    expenditures: data.expenditures,
  };
}

/**
 * @param {Object} payload
 * @param {string} payload.id
 * @param {string} payload.type
 * @param {string} payload.userId
 * @param {string} payload.categoryId
 * @param {string} payload.date
 * @param {number} payload.sum
 * @param {string} payload.comment
 * @param {Array<ExpenditureItem>} payload.expenditures
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 * }>}
 * */
async function createValidator(payload) {
  const {
    id,
    type,
    userId,
    categoryId,
    date,
    sum,
    expenditures,
  } = payload;
  if (idInvalid(id)) {
    return {
      ok: false,
      reason: new Error(ERRORS.transactionsInvalidId),
    };
  }
  if (!['income', 'expense'].includes(type)) {
    return {
      ok: false,
      reason: new Error(ERRORS.transactionsInvalidType),
    };
  }
  if (!await usersExists(userId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.transactionsInvalidUser),
    };
  }
  if (!await categoriesExists(categoryId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.transactionsInvalidCategory),
    };
  }
  if (!datesValidate(date)) {
    return {
      ok: false,
      reason: new Error(ERRORS.transactionsInvalidDate),
    };
  }
  if (!sumValidate(sum)) {
    return {
      ok: false,
      reason: new Error(ERRORS.transactionsInvalidSum),
    };
  }
  if (!await expendituresValidator(expenditures)) {
    return {
      ok: false,
      reason: new Error(ERRORS.transactionsInvalidExpenditures),
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
 * @param {Array<ExpenditureItem>} payload.expenditures
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 * }>}
 * */
async function updateValidator(payload) {
  const {
    userId,
    categoryId,
    date,
    sum,
    expenditures,
  } = payload;
  if (typeof userId !== 'undefined' && !await usersExists(userId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.transactionsInvalidUser),
    };
  }
  if (typeof categoryId !== 'undefined' && !await categoriesExists(categoryId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.transactionsInvalidCategory),
    };
  }
  if (typeof date !== 'undefined' && !datesValidate(date)) {
    return {
      ok: false,
      reason: new Error(ERRORS.transactionsInvalidDate),
    };
  }
  if (typeof sum !== 'undefined' && !sumValidate(sum)) {
    return {
      ok: false,
      reason: new Error(ERRORS.transactionsInvalidSum),
    };
  }
  if (typeof sum !== 'undefined' && !await expendituresValidator(expenditures)) {
    return {
      ok: false,
      reason: new Error(ERRORS.transactionsInvalidExpenditures),
    };
  }
  return {
    ok: true,
    reason: null,
  }
}

export const transactionsOperations = {
  ...basicOperations,
  publicMapper,
  createValidator,
  updateValidator,
};

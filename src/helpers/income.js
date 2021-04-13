import { idInvalid } from '@/libs/id';
import { datesValidate } from '@/libs/dates';
import { sumValidate } from '@/libs/sum';
import { ERRORS } from '@/helpers/errors';
import { resourceOperationsCreate } from '@/helpers/resourceOperations';
import { usersExists } from '@/helpers/users';
import { categoriesExists } from '@/helpers/categories';

/**
 * @typedef {Object} IncomeItem
 * @property {string} userId
 * @property {string} categoryId
 * @property {string} date
 * @property {number} sum
 * @property {string} comment
 * */

/**
 * @typedef {Object} IncomeItemPublic
 * @property {string} id
 * @property {string} userId
 * @property {string} categoryId
 * @property {string} date
 * @property {number} sum
 * @property {string} comment
 * */

const basicOperations = resourceOperationsCreate('INCOME');

/**
 * @param {string} id
 * @param {IncomeItem} data
 * @return {IncomeItemPublic}
 * */
function publicMapper(id, data) {
  return {
    id,
    userId: data.userId,
    categoryId: data.categoryId,
    date: data.date,
    sum: data.sum,
    comment: data.comment,
  };
}

/**
 * @param {Object} payload
 * @param {string} payload.id
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
async function createValidator(payload) {
  const {
    id,
    userId,
    categoryId,
    date,
    sum,
  } = payload;
  if (idInvalid(id)) {
    return {
      ok: false,
      reason: new Error(ERRORS.incomeInvalidId),
    };
  }
  if (!await usersExists(userId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.incomeInvalidUser),
    };
  }
  if (!await categoriesExists(categoryId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.incomeInvalidCategory),
    };
  }
  if (!datesValidate(date)) {
    return {
      ok: false,
      reason: new Error(ERRORS.incomeInvalidDate),
    };
  }
  if (!sumValidate(sum)) {
    return {
      ok: false,
      reason: new Error(ERRORS.incomeInvalidSum),
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
async function updateValidator(payload) {
  const {
    userId,
    categoryId,
    date,
    sum,
  } = payload;
  if (typeof userId !== 'undefined' && !await usersExists(userId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.incomeInvalidUser),
    };
  }
  if (typeof categoryId !== 'undefined' && !await categoriesExists(categoryId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.incomeInvalidCategory),
    };
  }
  if (typeof date !== 'undefined' && !datesValidate(date)) {
    return {
      ok: false,
      reason: new Error(ERRORS.incomeInvalidDate),
    };
  }
  if (typeof sum !== 'undefined' && !sumValidate(sum)) {
    return {
      ok: false,
      reason: new Error(ERRORS.incomeInvalidSum),
    };
  }
  return {
    ok: true,
    reason: null,
  }
}

export const incomeOperations = {
  ...basicOperations,
  publicMapper,
  createValidator,
  updateValidator,
};

import { idInvalid } from '@/libs/id';
import { datesValidate, datesInRange } from '@/libs/dates';
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

/**
 * @param {Object} query
 * @param {string} query.offset
 * @param {string} query.length
 * @param {string} query.byType
 * @param {string} query.byCategory
 * @param {[string, string]} query.inDateRange
 * @param {string} query.withCommodity
 * @param {string} query.withEssential
 * @return {function(Array<DBItem>): Array<DBItem>}
 * */
function getSelector(query) {
  const offset = typeof query.offset !== 'undefined'
    ? parseInt(query.offset, 10)
    : -1;
  const length = typeof query.length !== 'undefined'
    ? parseInt(query.length, 10)
    : -1;
  const byType = ['income', 'expense'].includes(query.byType)
    ? query.byType
    : '';
  const byCategory = typeof query.byCategory === 'string'
    && query.byCategory.length > 0
    ? query.byCategory
    : '';
  const [dateFrom, dateTo] = Array.isArray(query.inDateRange)
    && query.inDateRange.length === 2
    ? query.inDateRange
    : ['', ''];
  const withCommodity = typeof query.withCommodity === 'string'
    && query.withCommodity.length > 0
    ? query.withCommodity
    : '';
  const withEssential = typeof query.withEssential === 'string'
    && query.withEssential === '1'
    ? 1
    : -1;
  const hasFiltering = !!byType
    || !!byCategory
    || !!dateFrom
    || !!dateTo
    || !!withCommodity
    || withEssential !== -1;
  const hasPaging = offset !== -1
    || length !== -1

  /**
   * @param {Array<DBItem>} items
   * @return {Array<DBItem>}
   * */
  function selector(items) {
    if (!hasFiltering && !hasPaging) {
      return items;
    }
    const start = offset !== -1
      ? offset
      : 0;
    const end = length !== -1
      ? length
      : items.length
    return items
      .filter((item) => {
        /** @type {TransactionItem} */
        const data = item.data;
        const invalidType = byType
          && data.type !== byType;
        const invalidCategory = byCategory
          && data.categoryId !== byCategory;
        const invalidDate = (dateFrom || dateTo)
          && !datesInRange(data.date, dateFrom, dateTo);
        const invalidCommodity = withCommodity
          && !data.expenditures.some((expenditure) => expenditure.commodityId === withCommodity);
        const invalidEssential = withEssential === 1
          && !data.expenditures.some((expenditure) => expenditure.essential === true);
        const invalidAnything = invalidType
          || invalidCategory
          || invalidDate
          || invalidCommodity
          || invalidEssential;

        return !invalidAnything;
      })
      .slice(start, end)
  }

  return selector;
}

const basicOperations = resourceOperationsCreate('TRANSACTIONS', getSelector);

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

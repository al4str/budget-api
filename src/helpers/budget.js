import { dbGetItems, dbGetItem, dbCreate } from '@/libs/db';

/**
 * @typedef {Object} BudgetValueItem
 * @property {string} categoryId
 * @property {number} value
 * */

const ID = 'FIXED';

/**
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: Array<BudgetValueItem>
 * }>}
 * */
export async function budgetGetAverageValues() {
  try {
    /** @type {Array<TransactionItemPublic>} */
    const transactions = dbGetItems({ name: 'TRANSACTIONS' })
      .filter((item) => !item.meta.deleted)
      .map((item) => {
        /** @type {TransactionItem} */
        const data = item.data;
        /** @type {TransactionItemPublic} */
        const transaction = {
          ...data,
          id: item.id
        };

        return transaction;
      })
      .filter((transaction) => transaction.type === 'expense');
    /** @type {Map<string, Array<number>>} */
    const sumMap = new Map();
    transactions.forEach((transaction) => {
      const prevSumItems = sumMap.get(transaction.categoryId) || [];
      const nextSum = prevSumItems.concat([transaction.sum]);
      sumMap.set(transaction.categoryId, nextSum);
    });
    const averageValues = Array
      .from(sumMap.entries())
      .map(([categoryId, sumItems]) => {
        const totalSum = sumItems.reduce((prevSum, sum) => {
          return prevSum + sum;
        }, 0);
        const averageSum = totalSum / sumItems.length;

        return {
          categoryId,
          value: Number.isNaN(averageSum)
            ? 0.00
            : averageSum,
        };
      });

    return {
      ok: true,
      reason: null,
      data: averageValues,
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
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: Array<BudgetValueItem>
 * }>}
 * */
export async function budgetGetFixedValues() {
  try {
    const item = dbGetItem({ name: 'BUDGET', id: ID });
    /** @type {Array<BudgetValueItem>} */
    const values = item.data.values;

    return {
      ok: true,
      reason: null,
      data: values,
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
 * @param {Array<BudgetValueItem>} params.values
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: Array<BudgetValueItem>
 * }>}
 * */
export async function budgetFixValues(params) {
  try {
    const { values: inputValues, byUserId } = params;
    const item = dbCreate({
      name: 'BUDGET',
      id: ID,
      data: { values: inputValues },
      userId: byUserId,
    });
    /** @type {Array<BudgetValueItem>} */
    const values = item.data.values;

    return {
      ok: true,
      reason: null,
      data: values,
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

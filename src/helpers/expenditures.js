import { ERRORS } from '@/helpers/errors';
import { commoditiesExists } from '@/helpers/commodities';

/**
 * @typedef {Object} ExpenditureItem
 * @property {string} commodityId
 * @property {number} amount
 * @property {boolean} essential
 * */

/**
 * @param {Array<ExpenditureItem>} items
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 * }>}
 * */
export async function expendituresValidator(items) {
  if (!Array.isArray(items) || items.length === 0) {
    return {
      ok: true,
      reason: null,
    };
  }
  const commoditiesResults = await Promise.all(items
    .map((item) => commoditiesExists(item.commodityId)));
  if (commoditiesResults.some((result) => !result)) {
    return {
      ok: false,
      reason: new Error(ERRORS.expendituresInvalidCommodity),
    };
  }
  return {
    ok: true,
    reason: null,
  };
}

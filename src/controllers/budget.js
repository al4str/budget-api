import { ERRORS } from '@/helpers/errors';
import {
  budgetGetAverageValues,
  budgetGetFixedValues,
  budgetFixValues,
} from '@/helpers/budget';

/**
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: Array<BudgetItem>
 * }>}
 * */
export async function budgetObtainAverageValues() {
  const result = await budgetGetAverageValues();

  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason.toString(),
      data: result.data,
    };
  }
  return {
    ok: true,
    reason: '',
    data: result.data,
  };
}

/**
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: BudgetData
 * }>}
 * */
export async function budgetObtainFixedValues() {
  const result = await budgetGetFixedValues();

  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason.toString(),
      data: result.data,
    };
  }
  return {
    ok: true,
    reason: '',
    data: result.data,
  };
}

/**
 * @param {BudgetData} payload
 * @param {UsersItemFull} byUser
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: BudgetData
 * }>}
 * */
export async function budgetUpdateFixedValues(payload, byUser) {
  if (typeof payload !== 'object' || !payload) {
    return {
      ok: false,
      reason: ERRORS.resourceInvalidParams,
      data: {
        items: [],
        income: 0.00,
      },
    };
  }
  if (!byUser) {
    return {
      ok: false,
      reason: ERRORS.resourceUnknownUser,
      data: {
        items: [],
        income: 0.00,
      },
    };
  }
  const result = await budgetFixValues({
    payload,
    byUserId: byUser.id,
  });

  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason.toString(),
      data: result.data,
    };
  }
  return {
    ok: true,
    reason: '',
    data: result.data,
  };
}

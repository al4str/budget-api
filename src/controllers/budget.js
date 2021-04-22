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
 *   data: Array<BudgetValueItem>
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
 *   data: Array<BudgetValueItem>
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
 * @param {Object} payload
 * @param {Array<BudgetValueItem>} payload.values
 * @param {UsersItemFull} byUser
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: Array<BudgetValueItem>
 * }>}
 * */
export async function budgetUpdateFixedValues(payload, byUser) {
  if (typeof payload !== 'object' || !payload || !Array.isArray(payload.values)) {
    return {
      ok: false,
      reason: ERRORS.resourceInvalidParams,
      data: null,
    };
  }
  if (!byUser) {
    return {
      ok: false,
      reason: ERRORS.resourceUnknownUser,
      data: null,
    };
  }
  const { values } = payload;
  const result = await budgetFixValues({
    values,
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

import { idGet } from '@/libs/id';
import { datesValidate } from '@/libs/dates';
import { usersExists } from '@/helpers/users';
import { categoriesExists } from '@/helpers/categories';
import {
  incomeExists,
  incomeItem,
  incomeList,
  incomeCreate,
  incomeUpdate,
  incomeDelete,
} from '@/helpers/income';

/**
 * @param {string} id
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: null|IncomeItemPublic
 * }>}
 * */
export async function incomeGetItem(id) {
  if (!id) {
    return {
      ok: false,
      reason: 'Missing params',
      data: null,
    };
  }
  if (!await incomeExists(id)) {
    return {
      ok: false,
      reason: 'Does not exist',
      data: null,
    };
  }
  const result = await incomeItem({
    id,
  });

  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason.toString(),
      data: null,
    };
  }
  return {
    ok: true,
    reason: '',
    data: {
      id,
      userId: result.data.userId,
      categoryId: result.data.categoryId,
      date: result.data.date,
      sum: result.data.sum,
      comment: result.data.comment,
    },
  };
}

/**
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: Array<IncomeItemPublic>
 * }>}
 * */
export async function incomeGetList() {
  const result = await incomeList();

  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason.toString(),
      data: [],
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
 * @param {string} payload.id
 * @param {string} payload.userId
 * @param {string} payload.categoryId
 * @param {string} payload.date
 * @param {number} payload.sum
 * @param {string} payload.comment
 * @param {UsersItemFull} byUser
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: null|IncomeItemPublic
 * }>}
 * */
export async function incomeCreateItem(payload, byUser) {
  if (!payload) {
    return {
      ok: false,
      reason: 'Missing params',
      data: null,
    };
  }
  if (!byUser) {
    return {
      ok: false,
      reason: 'Unknown user',
      data: null,
    };
  }
  const id = idGet();
  const {
    userId,
    categoryId,
    date,
    sum,
    comment,
  } = payload;
  if (await incomeExists(id)) {
    return {
      ok: false,
      reason: 'Already exist',
      data: null,
    };
  }
  if (!await usersExists(userId)) {
    return {
      ok: false,
      reason: 'User does not exist',
      data: null,
    };
  }
  if (!await categoriesExists(categoryId)) {
    return {
      ok: false,
      reason: 'Category does not exist',
      data: null,
    };
  }
  if (!datesValidate(date)) {
    return {
      ok: false,
      reason: 'Invalid date',
      data: null,
    };
  }
  if (!sum || typeof sum !== 'number' || Number.isNaN(sum)) {
    return {
      ok: false,
      reason: 'Invalid sum',
      data: null,
    };
  }
  const result = await incomeCreate({
    id,
    payload: {
      userId,
      categoryId,
      date,
      sum,
      comment,
    },
    byUserId: byUser.id,
  });

  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason.toString(),
      data: null,
    };
  }
  return {
    ok: true,
    reason: '',
    data: {
      id,
      userId: result.data.userId,
      categoryId: result.data.categoryId,
      date: result.data.date,
      sum: result.data.sum,
      comment: result.data.comment,
    },
  };
}

/**
 * @param {string} id
 * @param {Object} payload
 * @param {string} payload.userId
 * @param {string} payload.categoryId
 * @param {string} payload.date
 * @param {number} payload.sum
 * @param {string} payload.comment
 * @param {UsersItemFull} byUser
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: null|IncomeItemPublic
 * }>}
 * */
export async function incomeUpdateItem(id, payload, byUser) {
  if (!id || !payload) {
    return {
      ok: false,
      reason: 'Missing params',
      data: null,
    };
  }
  if (!byUser) {
    return {
      ok: false,
      reason: 'Unknown user',
      data: null,
    };
  }
  const {
    userId,
    categoryId,
    date,
    sum,
    comment,
  } = payload;
  if (!await incomeExists(id)) {
    return {
      ok: false,
      reason: 'Does not exist',
      data: null,
    };
  }
  if (typeof userId !== 'undefined' && !await usersExists(userId)) {
    return {
      ok: false,
      reason: 'User does not exist',
      data: null,
    };
  }
  if (typeof categoryId !== 'undefined' && !await categoriesExists(categoryId)) {
    return {
      ok: false,
      reason: 'Category does not exist',
      data: null,
    };
  }
  if (typeof date !== 'undefined' && !datesValidate(date)) {
    return {
      ok: false,
      reason: 'Invalid date',
      data: null,
    };
  }
  if (typeof sum !== 'undefined' && !sum || typeof sum !== 'number' || Number.isNaN(sum)) {
    return {
      ok: false,
      reason: 'Invalid sum',
      data: null,
    };
  }
  const result = await incomeUpdate({
    id,
    payload: {
      userId,
      categoryId,
      date,
      sum,
      comment,
    },
    byUserId: byUser.id,
  });

  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason.toString(),
      data: null,
    };
  }
  return {
    ok: true,
    reason: '',
    data: {
      id,
      userId: result.data.userId,
      categoryId: result.data.categoryId,
      date: result.data.date,
      sum: result.data.sum,
      comment: result.data.comment,
    },
  };
}

/**
 * @param {string} id
 * @param {UsersItemFull} byUser
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: null|IncomeItemPublic
 * }>}
 * */
export async function incomeDeleteItem(id, byUser) {
  if (!id) {
    return {
      ok: false,
      reason: 'Missing params',
      data: null,
    };
  }
  if (!byUser) {
    return {
      ok: false,
      reason: 'Unknown user',
      data: null,
    };
  }
  if (!await incomeExists(id)) {
    return {
      ok: false,
      reason: 'Does not exist',
      data: null,
    };
  }
  const result = await incomeDelete({
    id,
    byUserId: byUser.id,
  });

  if (!result.ok) {
    return {
      ok: false,
      reason: result.reason.toString(),
      data: null,
    };
  }
  return {
    ok: true,
    reason: '',
    data: {
      id,
      userId: result.data.userId,
      categoryId: result.data.categoryId,
      date: result.data.date,
      sum: result.data.sum,
      comment: result.data.comment,
    },
  };
}

import {
  dbDoesItemExist,
  dbGetItems,
  dbGetItem,
  dbCreate,
  dbUpdate,
  dbDelete,
} from '@/libs/db';

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

/**
 * @param {string} id
 * @return {Promise<boolean>}
 * */
export async function incomeExists(id) {
  try {
    return dbDoesItemExist({
      name: 'INCOME',
      id,
    });
  }
  catch (err) {
    return false;
  }
}

/**
 * @param {Object} params
 * @param {string} params.id
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|IncomeItem
 * }>}
 * */
export async function incomeItem(params) {
  try {
    const { id } = params;
    const item = dbGetItem({
      name: 'INCOME',
      id,
    });

    if (!item || item.meta.deleted) {
      return {
        ok: false,
        reason: new Error('Does not exist'),
        data: null,
      };
    }
    return {
      ok: true,
      reason: null,
      data: item.data,
    };
  }
  catch (err) {
    return {
      ok: false,
      reason: err,
      data: null,
    };
  }
}

/**
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: Array<IncomeItemPublic>
 * }>}
 * */
export async function incomeList() {
  try {
    const items = dbGetItems({
      name: 'INCOME',
    });
    const list = items
      .filter((item) => !item.meta.deleted)
      .map((item) => {
        /** @type {IncomeItem} */
        const data = item.data;

        return {
          ...data,
          id: item.id,
        };
      })

    return {
      ok: true,
      reason: null,
      data: list,
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
 * @param {string} params.id
 * @param {IncomeItem} params.payload
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|IncomeItem
 * }>}
 * */
export async function incomeCreate(params) {
  try {
    const {
      id,
      payload,
      byUserId,
    } = params;
    const item = dbCreate({
      name: 'INCOME',
      id,
      data: payload,
      userId: byUserId,
    });

    return {
      ok: true,
      reason: null,
      data: item.data,
    };
  }
  catch (err) {
    return {
      ok: false,
      reason: err,
      data: null,
    };
  }
}

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {Partial<IncomeItem>} params.payload
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|IncomeItem
 * }>}
 * */
export async function incomeUpdate(params) {
  try {
    const {
      id,
      payload,
      byUserId,
    } = params;
    const item = dbUpdate({
      name: 'INCOME',
      id,
      updater(prevItem) {
        return {
          ...prevItem,
          data: {
            ...prevItem.data,
            ...payload,
          },
        };
      },
      userId: byUserId,
    });

    return {
      ok: true,
      reason: null,
      data: item.data,
    };
  }
  catch (err) {
    return {
      ok: false,
      reason: err,
      data: null,
    };
  }
}

/**
 * @param {Object} params
 * @param {string} params.id
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|IncomeItem
 * }>}
 * */
export async function incomeDelete(params) {
  try {
    const {
      id,
      byUserId,
    } = params;
    const item = dbDelete({
      name: 'INCOME',
      id,
      userId: byUserId,
    });

    return {
      ok: true,
      reason: null,
      data: item.data,
    };
  }
  catch (err) {
    return {
      ok: false,
      reason: err,
      data: null,
    };
  }
}

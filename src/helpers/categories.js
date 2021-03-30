import {
  dbDoesItemExist,
  dbGetItems,
  dbGetItem,
  dbCreate,
  dbUpdate,
  dbDelete,
} from '@/libs/db';

/**
 * @typedef {Object} CategoryItem
 * @property {string} title
 * @property {'income'|'costs'} type
 * */

/**
 * @typedef {Object} CategoryItemPublic
 * @property {string} id
 * @property {string} title
 * @property {'income'|'costs'} type
 * */

/**
 * @param {string} id
 * @return {Promise<boolean>}
 * */
export async function categoriesExists(id) {
  try {
    return dbDoesItemExist({
      name: 'CATEGORIES',
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
 *   data: null|CategoryItem
 * }>}
 * */
export async function categoriesItem(params) {
  try {
    const { id } = params;
    const item = dbGetItem({
      name: 'CATEGORIES',
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
 *   data: Array<CategoryItemPublic>
 * }>}
 * */
export async function categoriesList() {
  try {
    const items = dbGetItems({
      name: 'CATEGORIES',
    });
    const list = items
      .filter((item) => !item.meta.deleted)
      .map((item) => {
        /** @type {CategoryItem} */
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
 * @param {CategoryItem} params.payload
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|CategoryItem
 * }>}
 * */
export async function categoriesCreate(params) {
  try {
    const {
      id,
      payload,
      byUserId,
    } = params;
    const item = dbCreate({
      name: 'CATEGORIES',
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
 * @param {Partial<CategoryItem>} params.payload
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|CategoryItem
 * }>}
 * */
export async function categoriesUpdate(params) {
  try {
    const {
      id,
      payload,
      byUserId,
    } = params;
    const item = dbUpdate({
      name: 'CATEGORIES',
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
 *   data: null|CategoryItem
 * }>}
 * */
export async function categoriesDelete(params) {
  try {
    const {
      id,
      byUserId,
    } = params;
    const item = dbDelete({
      name: 'CATEGORIES',
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

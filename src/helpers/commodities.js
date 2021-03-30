import {
  dbDoesItemExist,
  dbGetItems,
  dbGetItem,
  dbCreate,
  dbUpdate,
  dbDelete,
} from '@/libs/db';

/**
 * @typedef {Object} CommodityItem
 * @property {string} title
 * @property {string} categoryId
 * */

/**
 * @typedef {Object} CommodityItemPublic
 * @property {string} id
 * @property {string} title
 * @property {string} categoryId
 * */

/**
 * @param {string} id
 * @return {Promise<boolean>}
 * */
export async function commoditiesExists(id) {
  try {
    return dbDoesItemExist({
      name: 'COMMODITIES',
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
 *   data: null|CommodityItem
 * }>}
 * */
export async function commoditiesItem(params) {
  try {
    const { id } = params;
    const item = dbGetItem({
      name: 'COMMODITIES',
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
 *   data: Array<CommodityItemPublic>
 * }>}
 * */
export async function commoditiesList() {
  try {
    const items = dbGetItems({
      name: 'COMMODITIES',
    });
    const list = items
      .filter((item) => !item.meta.deleted)
      .map((item) => {
        /** @type {CommodityItem} */
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
 * @param {CommodityItem} params.payload
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|CommodityItem
 * }>}
 * */
export async function commoditiesCreate(params) {
  try {
    const {
      id,
      payload,
      byUserId,
    } = params;
    const item = dbCreate({
      name: 'COMMODITIES',
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
 * @param {Partial<CommodityItem>} params.payload
 * @param {string} params.byUserId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 *   data: null|CommodityItem
 * }>}
 * */
export async function commoditiesUpdate(params) {
  try {
    const {
      id,
      payload,
      byUserId,
    } = params;
    const item = dbUpdate({
      name: 'COMMODITIES',
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
 *   data: null|CommodityItem
 * }>}
 * */
export async function commoditiesDelete(params) {
  try {
    const {
      id,
      byUserId,
    } = params;
    const item = dbDelete({
      name: 'COMMODITIES',
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

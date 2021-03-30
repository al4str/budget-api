import { categoriesExists } from '@/helpers/categories';
import {
  commoditiesExists,
  commoditiesItem,
  commoditiesList,
  commoditiesCreate,
  commoditiesUpdate,
  commoditiesDelete,
} from '@/helpers/commodities';

/**
 * @param {string} id
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: null|CommodityItemPublic
 * }>}
 * */
export async function commoditiesGetItem(id) {
  if (!id) {
    return {
      ok: false,
      reason: 'Missing params',
      data: null,
    };
  }
  if (!await commoditiesExists(id)) {
    return {
      ok: false,
      reason: 'Does not exist',
      data: null,
    };
  }
  const result = await commoditiesItem({
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
      title: result.data.title,
      categoryId: result.data.categoryId,
    },
  };
}

/**
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: Array<CommodityItemPublic>
 * }>}
 * */
export async function commoditiesGetList() {
  const result = await commoditiesList();

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
 * @param {string} payload.title
 * @param {string} payload.categoryId
 * @param {UsersItemFull} byUser
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: null|CommodityItemPublic
 * }>}
 * */
export async function commoditiesCreateItem(payload, byUser) {
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
  const { id, title, categoryId } = payload;
  if (await commoditiesExists(id)) {
    return {
      ok: false,
      reason: 'Already exist',
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
  const result = await commoditiesCreate({
    id,
    payload: {
      title,
      categoryId,
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
      title: result.data.title,
      categoryId: result.data.categoryId,
    },
  };
}

/**
 * @param {string} id
 * @param {Object} payload
 * @param {string} payload.title
 * @param {UsersItemFull} byUser
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: null|CommodityItemPublic
 * }>}
 * */
export async function commoditiesUpdateItem(id, payload, byUser) {
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
  if (!await commoditiesExists(id)) {
    return {
      ok: false,
      reason: 'Does not exist',
      data: null,
    };
  }
  const { title } = payload;
  const result = await commoditiesUpdate({
    id,
    payload: {
      title,
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
      title: result.data.title,
      categoryId: result.data.categoryId,
    },
  };
}

/**
 * @param {string} id
 * @param {UsersItemFull} byUser
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: null|CommodityItemPublic
 * }>}
 * */
export async function commoditiesDeleteItem(id, byUser) {
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
  if (!await commoditiesExists(id)) {
    return {
      ok: false,
      reason: 'Does not exist',
      data: null,
    };
  }
  const result = await commoditiesDelete({
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
      title: result.data.title,
      categoryId: result.data.categoryId,
    },
  };
}

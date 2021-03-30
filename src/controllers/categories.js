import {
  categoriesExists,
  categoriesItem,
  categoriesList,
  categoriesCreate,
  categoriesUpdate,
  categoriesDelete,
} from '@/helpers/categories';

/**
 * @param {string} id
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: null|CategoryItemPublic
 * }>}
 * */
export async function categoriesGetItem(id) {
  if (!id) {
    return {
      ok: false,
      reason: 'Missing params',
      data: null,
    };
  }
  if (!await categoriesExists(id)) {
    return {
      ok: false,
      reason: 'Does not exist',
      data: null,
    };
  }
  const result = await categoriesItem({
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
      type: result.data.type,
    },
  };
}

/**
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: Array<CategoryItemPublic>
 * }>}
 * */
export async function categoriesGetList() {
  const result = await categoriesList();

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
 * @param {string|'income'|'costs'} payload.type
 * @param {UsersItemFull} byUser
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: null|CategoryItemPublic
 * }>}
 * */
export async function categoriesCreateItem(payload, byUser) {
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
  const { id, title, type } = payload;
  if (await categoriesExists(id)) {
    return {
      ok: false,
      reason: 'Already exist',
      data: null,
    };
  }
  if (!['income', 'costs'].includes(type)) {
    return {
      ok: false,
      reason: 'Unknown category type',
      data: null,
    };
  }
  const result = await categoriesCreate({
    id,
    payload: {
      title,
      type,
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
      type: result.data.type,
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
 *   data: null|CategoryItemPublic
 * }>}
 * */
export async function categoriesUpdateItem(id, payload, byUser) {
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
  if (!await categoriesExists(id)) {
    return {
      ok: false,
      reason: 'Does not exist',
      data: null,
    };
  }
  const { title } = payload;
  const result = await categoriesUpdate({
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
      type: result.data.type,
    },
  };
}

/**
 * @param {string} id
 * @param {UsersItemFull} byUser
 * @return {Promise<{
 *   ok: boolean
 *   reason: string
 *   data: null|CategoryItemPublic
 * }>}
 * */
export async function categoriesDeleteItem(id, byUser) {
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
  if (!await categoriesExists(id)) {
    return {
      ok: false,
      reason: 'Does not exist',
      data: null,
    };
  }
  const result = await categoriesDelete({
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
      type: result.data.type,
    },
  };
}

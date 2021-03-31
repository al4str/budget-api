import { idGet } from '@/libs/id';
import { dbDoesItemExist } from '@/libs/db';

/**
 * @template {Object} T
 * @template {T & { id: string }} R
 * @param {Object} params
 * @param {function(id: string, T): R} params.onPublicItemMap
 * @param {function(Object): Promise<{ ok: boolean, reason: null|Error }>} params.onCreateValidate
 * @param {function(Object): Promise<{ ok: boolean, reason: null|Error }>} params.onUpdateValidate
 * @param {function(id: string): Promise<boolean>} params.onItemExist
 * @param {function(params: { id: string }): Promise<{ ok: boolean, reason: null|Error, data: null|T }>} params.onItemGet
 * @param {function(): Promise<{ ok: boolean, reason: null|Error, data: Array<R> }>} params.onListGet
 * @param {function(params: { id: string, payload: Object, byUserId: string }): Promise<{ ok: boolean, reason: null|Error, data: null|T }>} params.onItemCreate
 * @param {function(params: { id: string, payload: Object, byUserId: string }): Promise<{ ok: boolean, reason: null|Error, data: null|T }>} params.onItemUpdate
 * @param {function(params: { id: string, byUserId: string }): Promise<{ ok: boolean, reason: null|Error, data: null|T }>} params.onItemDelete
 * @return {{
 *   getItem: function(id: string): Promise<{ ok: boolean, reason: string, data: null|T }>
 *   getList: function(): Promise<{ ok: boolean, reason: string, data: Array<R> }>
 *   createItem: function(payload: Object, byUser: UsersItemFull): Promise<{ ok: boolean, reason: string, data: null|T }>
 *   updateItem: function(id: string, payload: Object, byUser: UsersItemFull): Promise<{ ok: boolean, reason: string, data: null|T }>
 *   deleteItem: function(id: string, byUser: UsersItemFull): Promise<{ ok: boolean, reason: string, data: null|T }>
 * }}
 * */
export function genericControllers(params) {
  const {
    onPublicItemMap,
    onCreateValidate,
    onUpdateValidate,
    onItemExist,
    onItemGet,
    onListGet,
    onItemCreate,
    onItemUpdate,
    onItemDelete,
  } = params;

  /**
   * @param {string} id
   * @return {Promise<{
   *   ok: boolean
   *   reason: string
   *   data: null|Object
   * }>}
   * */
  async function getItem(id) {
    if (!id) {
      return {
        ok: false,
        reason: 'Missing params',
        data: null,
      };
    }
    if (!await onItemExist(id)) {
      return {
        ok: false,
        reason: 'Does not exist',
        data: null,
      };
    }
    const result = await onItemGet({
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
      data: onPublicItemMap(id, result.data),
    };
  }

  /**
   * @return {Promise<{
   *   ok: boolean
   *   reason: string
   *   data: Array<Object>
   * }>}
   * */
  async function getList() {
    const result = await onListGet();

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
   * @param {UsersItemFull} byUser
   * @return {Promise<{
   *   ok: boolean
   *   reason: string
   *   data: null|Object
   * }>}
   * */
  async function createItem(payload, byUser) {
    if (!payload) {
      return {
        ok: false,
        reason: 'Missing params',
        data: null,
      };
    }
    if (!await validateByUser(byUser)) {
      return {
        ok: false,
        reason: 'Unknown user',
        data: null,
      };
    }
    const id = idGet();
    const validation = await onCreateValidate(payload);
    if (!validation.ok) {
      return {
        ok: false,
        reason: validation.reason.toString(),
        data: null,
      };
    }
    const result = await onItemCreate({
      id,
      payload,
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
      data: onPublicItemMap(id, result.data),
    };
  }

  /**
   * @param {string} id
   * @param {Object} payload
   * @param {UsersItemFull} byUser
   * @return {Promise<{
   *   ok: boolean
   *   reason: string
   *   data: null|Object
   * }>}
   * */
  async function updateItem(id, payload, byUser) {
    if (!id || !payload) {
      return {
        ok: false,
        reason: 'Missing params',
        data: null,
      };
    }
    if (!await validateByUser(byUser)) {
      return {
        ok: false,
        reason: 'Unknown user',
        data: null,
      };
    }
    const validation = await onUpdateValidate(payload);
    if (!validation.ok) {
      return {
        ok: false,
        reason: validation.reason.toString(),
        data: null,
      };
    }
    const result = await onItemUpdate({
      id,
      payload,
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
      data: onPublicItemMap(id, result.data),
    };
  }

  /**
   * @param {string} id
   * @param {UsersItemFull} byUser
   * @return {Promise<{
   *   ok: boolean
   *   reason: string
   *   data: null|Object
   * }>}
   * */
  async function deleteItem(id, byUser) {
    if (!id) {
      return {
        ok: false,
        reason: 'Missing params',
        data: null,
      };
    }
    if (!await validateByUser(byUser)) {
      return {
        ok: false,
        reason: 'Unknown user',
        data: null,
      };
    }
    if (!await onItemExist(id)) {
      return {
        ok: false,
        reason: 'Does not exist',
        data: null,
      };
    }
    const result = await onItemDelete({
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
      data: onPublicItemMap(id, result.data),
    };
  }

  return {
    getItem,
    getList,
    createItem,
    updateItem,
    deleteItem,
  };
}

/**
 * @param {UsersItemFull} user
 * @return {Promise<boolean>}
 * */
async function validateByUser(user) {
  try {
    return dbDoesItemExist({
      name: 'USERS',
      id: user.id,
    });
  }
  catch (err) {
    return false;
  }
}

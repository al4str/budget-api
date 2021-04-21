import { dbDoesItemExist } from '@/libs/db';
import { ERRORS } from '@/helpers/errors';

/**
 * @template {Object} ResourceItem
 * @template {ResourceItem & { id: string }} ResourcePublic
 *
 * @param {Object} params
 * @param {{
 *  publicMapper: function(id: string, item: ResourceItem):
 *    ResourcePublic
 *  createValidator: function(Object): Promise<{
 *    ok: boolean
 *    reason: null|Error
 *  }>
 *  updateValidator: function(Object): Promise<{
 *    ok: boolean
 *    reason: null|Error
 *  }>
 *  list: function(Object): Promise<{
 *    ok: boolean
 *    reason: null|Error
 *    data: Array<ResourcePublic>
 *  }>
 *  read: function(params: {
 *    id: string
 *  }): Promise<{
 *    ok: boolean
 *    reason: null|Error
 *    data: null|ResourceItem
 *  }>
 *  create: function(params: {
 *    id: string
 *    payload: Object
 *    byUserId: string
 *  }): Promise<{
 *    ok: boolean
 *    reason: null|Error
 *    data: null|ResourceItem
 *  }>
 *  update: function(params: {
 *    id: string
 *    payload: Object
 *    byUserId: string
 *  }): Promise<{
 *    ok: boolean
 *    reason: null|Error
 *    data: null|ResourceItem
 *  }>
 *  remove: function(params: {
 *    id: string
 *    byUserId: string
 *  }): Promise<{
 *    ok: boolean
 *    reason: null|Error
 *    data: null|ResourceItem
 *  }>
 *  exist: function(id: string): Promise<boolean>
 * }} params.operations
 *
 * @return {{
 *   list: function(Object): Promise<{
 *     ok: boolean,
 *     reason: string
 *     data: Array<ResourcePublic>
 *   }>
 *   read: function(id: string): Promise<{
 *     ok: boolean,
 *     reason: string
 *     data: null|ResourceItem
 *   }>
 *   create: function(
 *     payload: Object
 *     byUser: UsersItemFull
 *   ): Promise<{
 *     ok: boolean,
 *     reason: string
 *     data: null|ResourceItem
 *   }>
 *   update: function(
 *     id: string
 *     payload: Object,
 *     byUser: UsersItemFull
 *   ): Promise<{
 *     ok: boolean,
 *     reason: string
 *     data: null|ResourceItem
 *   }>
 *   remove: function(
 *     id: string,
 *     byUser: UsersItemFull
 *   ): Promise<{
 *     ok: boolean
 *     reason: string
 *     data: null|ResourceItem
 *   }>
 *   exist: function(id: string): Promise<{
 *     ok: boolean
 *     reason: string
 *     data: boolean
 *   }>
 * }}
 * */
export function resourceControllerCreate(params) {
  const { operations } = params;

  /**
   * @param {Object} query
   * @return {Promise<{
   *   ok: boolean
   *   reason: string
   *   data: Array<Object>
   * }>}
   * */
  async function list(query) {
    const result = await operations.list(query);

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
   * @param {string} id
   * @return {Promise<{
   *   ok: boolean
   *   reason: string
   *   data: null|Object
   * }>}
   * */
  async function read(id) {
    if (!id) {
      return {
        ok: false,
        reason: ERRORS.resourceInvalidParams,
        data: null,
      };
    }
    if (!await operations.exist(id)) {
      return {
        ok: false,
        reason: ERRORS.resourceNotExist,
        data: null,
      };
    }
    const result = await operations.read({
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
      data: operations.publicMapper(id, result.data),
    };
  }

  /**
   * @param {Object & { id: string }} payload
   * @param {UsersItemFull} byUser
   * @return {Promise<{
   *   ok: boolean
   *   reason: string
   *   data: null|Object
   * }>}
   * */
  async function create(payload, byUser) {
    if (!payload) {
      return {
        ok: false,
        reason: ERRORS.resourceInvalidParams,
        data: null,
      };
    }
    if (!await validateByUser(byUser)) {
      return {
        ok: false,
        reason: ERRORS.resourceUnknownUser,
        data: null,
      };
    }
    if (await operations.exist(payload.id)) {
      return {
        ok: false,
        reason: ERRORS.resourceAlreadyExist,
        data: null,
      };
    }
    const validation = await operations.createValidator(payload);
    if (!validation.ok) {
      return {
        ok: false,
        reason: validation.reason.toString(),
        data: null,
      };
    }
    const { id, ...restPayload } = payload;
    const result = await operations.create({
      id,
      payload: restPayload,
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
      data: operations.publicMapper(id, result.data),
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
  async function update(id, payload, byUser) {
    if (!id || !payload) {
      return {
        ok: false,
        reason: ERRORS.resourceInvalidParams,
        data: null,
      };
    }
    if (!await validateByUser(byUser)) {
      return {
        ok: false,
        reason: ERRORS.resourceUnknownUser,
        data: null,
      };
    }
    const validation = await operations.updateValidator(payload);
    if (!validation.ok) {
      return {
        ok: false,
        reason: validation.reason.toString(),
        data: null,
      };
    }
    const result = await operations.update({
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
      data: operations.publicMapper(id, result.data),
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
  async function remove(id, byUser) {
    if (!id) {
      return {
        ok: false,
        reason: ERRORS.resourceInvalidParams,
        data: null,
      };
    }
    if (!await validateByUser(byUser)) {
      return {
        ok: false,
        reason: ERRORS.resourceUnknownUser,
        data: null,
      };
    }
    if (!await operations.exist(id)) {
      return {
        ok: false,
        reason: ERRORS.resourceNotExist,
        data: null,
      };
    }
    const result = await operations.remove({
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
      data: operations.publicMapper(id, result.data),
    };
  }

  /**
   * @param {string} id
   * @return {Promise<{
   *   ok: boolean
   *   reason: string
   *   data: boolean
   * }>}
   * */
  async function exist(id) {
    if (!id) {
      return {
        ok: false,
        reason: ERRORS.resourceInvalidParams,
        data: true,
      };
    }
    const exist = await operations.exist(id);

    return {
      ok: true,
      reason: '',
      data: exist,
    };
  }

  return {
    list,
    read,
    create,
    update,
    remove,
    exist,
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

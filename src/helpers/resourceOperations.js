import {
  dbDoesItemExist,
  dbGetItems,
  dbGetItem,
  dbCreate,
  dbUpdate,
  dbDelete,
} from '@/libs/db';
import { ERRORS } from '@/helpers/errors';

/**
 * @template {Object} ResourceItem
 * @template {ResourceItem & { id: string }} ResourcePublic
 *
 * @param {DBName} resource
 * @param {function(query: Object):
 *   function(Array<DBItem>): Array<DBItem>} [getSelector]
 *
 * @return {{
 *   list: function(Object): Promise<{
 *     ok: boolean
 *     reason: null|Error
 *     data: Array<ResourcePublic>
 *   }>
 *   read: function(params: {
 *     id: string
 *   }): Promise<{
 *     ok: boolean
 *     reason: null|Error
 *     data: null|ResourceItem
 *   }>
 *   create: function(params: {
 *     id: string
 *     payload: ResourceItem
 *     byUserId: string
 *   }): Promise<{
 *     ok: boolean
 *     reason: null|Error
 *     data: null|ResourceItem
 *   }>
 *   update: function(params: {
 *     id: string
 *     payload: Partial<ResourceItem>
 *     byUserId: string
 *   }): Promise<{
 *     ok: boolean
 *     reason: null|Error
 *     data: null|ResourceItem
 *   }>
 *   remove: function(params: {
 *     id: string
 *     byUserId: string
 *   }): Promise<{
 *     ok: boolean
 *     reason: null|Error
 *     data: null|ResourceItem
 *   }>
 *   exist: function(id: string): Promise<boolean>
 * }}
 * */
export function resourceOperationsCreate(resource, getSelector) {
  /**
   * @param {Object} query
   * @return {Promise<{
   *   ok: boolean
   *   reason: null|Error
   *   data: Array<Object & { id: string }>
   * }>}
   * */
  async function list(query) {
    try {
      /**
       * @param {Array<DBItem>} items
       * @return {Array<DBItem>}
       * */
      const itemsSelector = (items) => {
        if (typeof getSelector === 'function') {
          const selector = getSelector(query);
          return selector(items);
        }
        return items;
      };
      const itemsAll = dbGetItems({
        name: resource,
      });
      const itemsNotDeleted = itemsAll.filter((item) => !item.meta.deleted);
      const itemsSelected = itemsSelector(itemsNotDeleted);
      const items = itemsSelected.map((item) => {
          /** @type {Object} */
          const data = item.data;

          return {
            ...data,
            id: item.id,
          };
        })

      return {
        ok: true,
        reason: null,
        data: items,
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
   * @return {Promise<{
   *   ok: boolean
   *   reason: null|Error
   *   data: null|Object
   * }>}
   * */
  async function read(params) {
    try {
      const { id } = params;
      const item = dbGetItem({
        name: resource,
        id,
      });

      if (!item || item.meta.deleted) {
        return {
          ok: false,
          reason: new Error(ERRORS.resourceNotExist),
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
   * @param {Object} params
   * @param {string} params.id
   * @param {Object} params.payload
   * @param {string} params.byUserId
   * @return {Promise<{
   *   ok: boolean
   *   reason: null|Error
   *   data: null|Object
   * }>}
   * */
  async function create(params) {
    try {
      const {
        id,
        payload,
        byUserId,
      } = params;
      const item = dbCreate({
        name: resource,
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
   * @param {Partial<Object>} params.payload
   * @param {string} params.byUserId
   * @return {Promise<{
   *   ok: boolean
   *   reason: null|Error
   *   data: null|Object
   * }>}
   * */
  async function update(params) {
    try {
      const {
        id,
        payload,
        byUserId,
      } = params;
      const item = dbUpdate({
        name: resource,
        id,
        updater(prevData) {
          return {
            ...prevData,
            ...payload,
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
   *   data: null|Object
   * }>}
   * */
  async function remove(params) {
    try {
      const {
        id,
        byUserId,
      } = params;
      const item = dbDelete({
        name: resource,
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

  /**
   * @param {string} id
   * @return {Promise<boolean>}
   * */
  async function exist(id) {
    try {
      return dbDoesItemExist({
        name: resource,
        id,
      });
    }
    catch (err) {
      return false;
    }
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

import {
  dbDoesItemExist,
  dbGetItems,
  dbGetItem,
  dbCreate,
  dbUpdate,
  dbDelete,
} from '@/libs/db';

/**
 * @template {Object} T
 * @param {DBName} name
 * @return {{
 *   createItem: function(params: { id: string, payload: T, byUserId: string }): Promise<{ ok: boolean, reason: null|Error, data: null|T }>
 *   readItem: function(params: { id: string }): Promise<{ ok: boolean, reason: null|Error, data: null|T }>
 *   updateItem: function(params: { id: string, payload: Partial<T>, byUserId: string }): Promise<{ ok: boolean, reason: null|Error, data: null|T }>
 *   deleteItem: function(params: { id: string, byUserId: string }): Promise<{ ok: boolean, reason: null|Error, data: null|T }>
 *   listItems: function(): Promise<{ ok: boolean, reason: null|Error, data: Array<T & { id: string } }>
 *   existItem: function(id: string): Promise<boolean>
 * }}
 * */
export function genericOperations(name) {
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
  async function createItem(params) {
    try {
      const {
        id,
        payload,
        byUserId,
      } = params;
      const item = dbCreate({
        name,
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
   * @return {Promise<{
   *   ok: boolean
   *   reason: null|Error
   *   data: null|Object
   * }>}
   * */
  async function readItem(params) {
    try {
      const { id } = params;
      const item = dbGetItem({
        name,
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
  async function updateItem(params) {
    try {
      const {
        id,
        payload,
        byUserId,
      } = params;
      const item = dbUpdate({
        name,
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
   *   data: null|Object
   * }>}
   * */
  async function deleteItem(params) {
    try {
      const {
        id,
        byUserId,
      } = params;
      const item = dbDelete({
        name,
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
   * @return {Promise<{
   *   ok: boolean
   *   reason: null|Error
   *   data: Array<Object & { id: string }>
   * }>}
   * */
  async function listItems() {
    try {
      const items = dbGetItems({
        name,
      });
      const list = items
        .filter((item) => !item.meta.deleted)
        .map((item) => {
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
   * @param {string} id
   * @return {Promise<boolean>}
   * */
  async function existItem(id) {
    try {
      return dbDoesItemExist({
        name,
        id,
      });
    }
    catch (err) {
      return false;
    }
  }

  return {
    createItem,
    readItem,
    updateItem,
    deleteItem,
    listItems,
    existItem,
  };
}

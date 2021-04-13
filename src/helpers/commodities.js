import { idInvalid } from '@/libs/id';
import { ERRORS } from '@/helpers/errors';
import { resourceOperationsCreate } from '@/helpers/resourceOperations';
import { categoriesExists } from '@/helpers/categories';

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

const basicOperations = resourceOperationsCreate('COMMODITIES');

export const commoditiesExists = basicOperations.exist;

/**
 * @param {string} id
 * @param {CommodityItem} data
 * @return {CommodityItemPublic}
 * */
function publicMapper(id, data) {
  return {
    id,
    title: data.title,
    categoryId: data.categoryId,
  };
}

/**
 * @param {Object} payload
 * @param {string} payload.id
 * @param {string} payload.title
 * @param {string} payload.categoryId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 * }>}
 * */
async function createValidator(payload) {
  const {
    id,
    title,
    categoryId,
  } = payload;
  if (idInvalid(id)) {
    return {
      ok: false,
      reason: new Error(ERRORS.commoditiesInvalidId),
    };
  }
  if (!title) {
    return {
      ok: false,
      reason: new Error(ERRORS.commoditiesInvalidTitle),
    };
  }
  if (!await categoriesExists(categoryId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.commoditiesInvalidCategory),
    };
  }
  return {
    ok: true,
    reason: null,
  }
}

/**
 * @param {Object} payload
 * @param {string} payload.title
 * @param {string} payload.categoryId
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 * }>}
 * */
async function updateValidator(payload) {
  const {
    title,
    categoryId,
  } = payload;
  if (typeof title !== 'undefined' && !title) {
    return {
      ok: false,
      reason: new Error(ERRORS.commoditiesInvalidTitle),
    };
  }
  if (typeof categoryId !== 'undefined' && !await categoriesExists(categoryId)) {
    return {
      ok: false,
      reason: new Error(ERRORS.commoditiesInvalidCategory),
    };
  }
  return {
    ok: true,
    reason: null,
  }
}

export const commoditiesOperations = {
  ...basicOperations,
  publicMapper,
  createValidator,
  updateValidator,
};

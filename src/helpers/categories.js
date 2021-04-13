import { idInvalid } from '@/libs/id';
import { ERRORS } from '@/helpers/errors';
import { resourceOperationsCreate } from '@/helpers/resourceOperations';

/**
 * @typedef {Object} CategoryItem
 * @property {string} title
 * @property {'income'|'expense'} type
 * */

/**
 * @typedef {Object} CategoryItemPublic
 * @property {string} id
 * @property {string} title
 * @property {'income'|'expense'} type
 * */

const basicOperations = resourceOperationsCreate('CATEGORIES');

export const categoriesExists = basicOperations.exist;

/**
 * @param {string} id
 * @param {CategoryItem} data
 * @return {CategoryItemPublic}
 * */
function publicMapper(id, data) {
  return {
    id,
    title: data.title,
    type: data.type,
  };
}

/**
 * @param {Object} payload
 * @param {string} payload.id
 * @param {string} payload.title
 * @param {'income'|'expense'} payload.type
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 * }>}
 * */
async function createValidator(payload) {
  const {
    id,
    title,
    type,
  } = payload;
  if (idInvalid(id)) {
    return {
      ok: false,
      reason: new Error(ERRORS.categoriesInvalidId),
    };
  }
  if (!title) {
    return {
      ok: false,
      reason: new Error(ERRORS.categoriesInvalidTitle),
    };
  }
  if (!['income', 'expense'].includes(type)) {
    return {
      ok: false,
      reason: new Error(ERRORS.categoriesInvalidType),
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
 * @param {'income'|'expense'} payload.type
 * @return {Promise<{
 *   ok: boolean
 *   reason: null|Error
 * }>}
 * */
async function updateValidator(payload) {
  const {
    title,
    type,
  } = payload;
  if (typeof title !== 'undefined' && !title) {
    return {
      ok: false,
      reason: new Error(ERRORS.categoriesInvalidTitle),
    };
  }
  if (typeof type !== 'undefined' && !['income', 'expense'].includes(type)) {
    return {
      ok: false,
      reason: new Error(ERRORS.categoriesInvalidType),
    };
  }
  return {
    ok: true,
    reason: null,
  }
}

export const categoriesOperations = {
  ...basicOperations,
  publicMapper,
  createValidator,
  updateValidator,
};

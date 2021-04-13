/**
 * @param {number} rawSum
 * @return {boolean}
 * */
export function sumValidate(rawSum) {
  return typeof rawSum === 'number'
    && !Number.isNaN(rawSum);
}

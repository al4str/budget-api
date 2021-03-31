/**
 * @param {number} rawSum
 * @return {boolean}
 * */
export function sumValidate(rawSum) {
  return !rawSum || typeof rawSum !== 'number' || Number.isNaN(rawSum);
}

/**
 * @param {string} rawDate
 * @return {boolean}
 * */
export function datesValidate(rawDate) {
  if (!rawDate) {
    return false;
  }
  try {
    const date = new Date(rawDate).getTime();

    return !Number.isNaN(date);
  }
  catch (err) {
    return false;
  }
}

/**
 * @return {number}
 * */
export function datesUTCGetTimestamp() {
  return new Date(new Date().toUTCString()).getTime();
}

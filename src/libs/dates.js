import { DateTime } from 'luxon';

/**
 * @param {string} date
 * @return {boolean}
 * */
export function datesValidate(date) {
  try {
    const dateObj = DateTime.fromISO(date);

    return dateObj.isValid;
  }
  catch (err) {
    return false;
  }
}

/**
 * @return {number}
 * */
export function datesUTCGetTimestamp() {
  const nowObj = DateTime.local().setZone('utc');

  return nowObj.toMillis();
}

/**
 * @param {string} date
 * @param {string} from
 * @param {string} to
 * @return {boolean}
 * */
export function datesInRange(date, from, to) {
  const dateObj = DateTime.fromISO(date);
  const fromObj = DateTime.fromISO(from).startOf('day');
  const toObj = DateTime.fromISO(to).endOf('day');
  if (dateObj.invalid || (fromObj.invalid && toObj.invalid)) {
    return false;
  }
  if (fromObj.invalid) {
    return dateObj <= toObj;
  }
  if (toObj.invalid) {
    return dateObj >= fromObj;
  }
  return dateObj >= fromObj && dateObj <= toObj;
}

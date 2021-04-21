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
  if (!dateObj.isValid || (!fromObj.isValid && !toObj.isValid)) {
    return false;
  }
  if (!fromObj.isValid) {
    return dateObj <= toObj;
  }
  if (!toObj.isValid) {
    return fromObj >= dateObj;
  }
  return fromObj >= dateObj && dateObj <= toObj;
}

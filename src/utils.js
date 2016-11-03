/* eslint-disable no-param-reassign */
/* eslint-disable no-plusplus */

export const NAN = 0 / 0;

export const isNumber = n => typeof n === 'number';

export const isFunction = value => typeof value === 'function';

export const inRange = (number, start, end) => {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  return number >= Math.min(start, end) && number < Math.max(start, end);
};

export const arrayEvery = (array, predicate = Boolean) => {
  const length = array == null ? 0 : array.length;
  let index = -1;

  while (++index < length) {
    if (!predicate(array[index], index, array)) {
      return false;
    }
  }
  return true;
};

export const arraySum = (array) => {
  const length = array == null ? 0 : array.length;
  let result = 0;
  let index = -1;

  while (++index < length) {
    const current = array[index];
    if (current !== undefined) {
      result += current;
    }
  }
  return result;
};

export const arrayMean = (array) => {
  const length = array == null ? 0 : array.length;
  return length ? (arraySum(array) / length) : NAN;
};

export const arrayLast = (array, n = 0) => {
  const length = array == null ? 0 : array.length;
  return array.slice(Math.max(length - n, 1));
};

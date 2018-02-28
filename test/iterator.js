'use strict';

const { Iterator } = api.common;

const array = [1, 2, 3, 4];

const test = (name, test) => api.metatests.test(name, test);

test('Iterator is iterable', test => {
  const iterator = new Iterator(array);
  let sum = 0;
  for (const value of iterator) {
    sum += value;
  }

  test.strictSame(sum, 10);
  test.end();
});

test('Iterator.forEach', test => {
  const iterator = new Iterator(array);
  let sum = 0;
  iterator.forEach(value => {
    sum += value;
  });

  test.strictSame(sum, 10);
  test.end();
});

test('Iterator.forEach with thisArg ', test => {
  const iterator = new Iterator(array);
  const obj = {
    sum: 0,
    fn(value) {
      this.sum += value;
    },
  };

  iterator.forEach(obj.fn, obj);

  test.strictSame(obj.sum, 10);
  test.end();
});

test('Iterator.reduce', test => {
  const iterator = new Iterator(array);
  const sum = iterator.reduce((previous, current) => previous + current, 0);

  test.strictSame(sum, 10);
  test.end();
});

test('Iterator.reduce with no initialValue', test => {
  const iterator = new Iterator(array);
  const sum = iterator.reduce((previous, current) => previous + current);

  test.strictSame(sum, 10);
  test.end();
});

test('Iterator.reduce with no initialValue on consumed iterator', test => {
  const iterator = new Iterator(array);
  test.throws(() => {
    iterator.reduce(() => {});
    iterator.reduce((previous, current) => previous + current);
  }, new TypeError('reduce of consumed iterator with no initial value'));

  test.end();
});

test('Iterator.map', test => {
  const iterator = new Iterator(array);
  const sum = iterator
    .map(value => value * 2)
    .reduce((previous, current) => previous + current, 0);

  test.strictSame(sum, 20);
  test.end();
});

test('Iterator.map with thisArg', test => {
  const iterator = new Iterator(array);
  const obj = {
    multiplier: 2,
    mapper(value) {
      return value * this.multiplier;
    },
  };

  const sum = iterator
    .map(obj.mapper, obj)
    .reduce((previous, current) => previous + current, 0);

  test.strictSame(sum, 20);
  test.end();
});

test('Iterator.filter', test => {
  const iterator = new Iterator(array);
  const sum = iterator
    .filter(value => !(value % 2))
    .reduce((previous, current) => previous + current, 0);

  test.strictSame(sum, 6);
  test.end();
});

test('Iterator.filter with thisArg', test => {
  const iterator = new Iterator(array);
  const obj = {
    divider: 2,
    predicate(value) {
      return !(value % this.divider);
    },
  };

  const sum = iterator
    .filter(obj.predicate, obj)
    .reduce((previous, current) => previous + current, 0);

  test.strictSame(sum, 6);
  test.end();
});

test('Iterator.each that must return true', test => {
  const iterator = new Iterator(array);
  const result = iterator.each(element => element > 0);

  test.assert(result);
  test.end();
});

test('Iterator.each that must return false', test => {
  const iterator = new Iterator(array);
  const result = iterator.each(element => element % 2);

  test.assertNot(result);
  test.end();
});

test('Iterator.each with thisArg', test => {
  const iterator = new Iterator(array);
  const obj = {
    min: 0,
    predicate(value) {
      return value > this.min;
    },
  };

  const result = iterator.each(obj.predicate, obj);

  test.assert(result);
  test.end();
});

test('Iterator.some that must return true', test => {
  const iterator = new Iterator(array);
  const result = iterator.some(element => element % 2);

  test.assert(result);
  test.end();
});

test('Iterator.some that must return false', test => {
  const iterator = new Iterator(array);
  const result = iterator.some(element => element < 0);

  test.assertNot(result);
  test.end();
});

test('Iterator.some with thisArg', test => {
  const iterator = new Iterator(array);
  const obj = {
    max: 0,
    predicate(value) {
      return value < this.max;
    },
  };

  const result = iterator.each(obj.predicate, obj);

  test.assertNot(result);
  test.end();
});

test('Iterator.find that must find an element', test => {
  const iterator = new Iterator(array);
  const value = iterator.find(element => element % 2 === 0);

  test.strictSame(value, 2);
  test.end();
});

test('Iterator.find that must not find an element', test => {
  const iterator = new Iterator(array);
  const value = iterator.find(element => element > 4);

  test.strictSame(value, undefined);
  test.end();
});

test('Iterator.find with thisArg', test => {
  const iterator = new Iterator(array);
  const obj = {
    divider: 2,
    predicate(value) {
      return value % this.divider === 0;
    },
  };
  const value = iterator.find(obj.predicate, obj);

  test.strictSame(value, 2);
  test.end();
});

test('Iterator.includes that must return true', test => {
  const iterator = new Iterator(array);
  const result = iterator.includes(1);

  test.assert(result);
  test.end();
});

test('Iterator.includes that must return false', test => {
  const iterator = new Iterator(array);
  const result = iterator.includes(0);

  test.assertNot(result);
  test.end();
});

test('Iterator.collectTo must collect to given collection', test => {
  const iterator = new Iterator(array);
  const arr = iterator.collectTo(Array);
  test.strictSame(arr, array);
  test.end();
});

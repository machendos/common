'use strict';

const { Enum } = api.common;

api.metatests.test('Enum with key/value', (test) => {
  const Month = Enum.from({
    Jan: 'January',
    Feb: 'February',
    Mar: 'March',
    Apr: 'April',
    May: 'May',
    Jun: 'June',
    Jul: 'July',
    Aug: 'August',
    Sep: 'September',
    Oct: 'October',
    Nov: 'November',
    Dec: 'December'
  });

  test.strictSame(typeof(Month), 'function');
  test.strictSame(typeof(Month.values), 'object');
  test.strictSame(Array.isArray(Month.values), false);

  test.strictSame(Month.has('May'), true);
  test.strictSame(Month.key('August'), 'Aug');

  const may = new Month('May');
  test.strictSame(typeof(may), 'object');
  test.strictSame(Month.has('May'), true);
  test.strictSame(may.value, 'May');

  test.strictSame(+may, NaN);
  test.strictSame(may + '', 'May');

  test.end();
});

api.metatests.test('Enum string month keys', (test) => {
  const Month = Enum.from(
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  );

  test.strictSame(typeof(Month), 'function');
  test.strictSame(typeof(Month.values), 'object');
  test.strictSame(Array.isArray(Month.values), false);

  test.strictSame(Month.has('May'), true);
  test.strictSame(Month.has('Aug'), false);
  test.strictSame(Month.key('August'), '7');

  const may = new Month('May');
  test.strictSame(typeof(may), 'object');
  test.strictSame(Month.has('May'), true);
  test.strictSame(may.value, '4');

  test.strictSame(may, Month.from('May'));

  test.strictSame(+may, 4);
  test.strictSame(may + '', '4');

  test.end();
});

api.metatests.test('Enum string month typed keys', (test) => {
  const Month = Enum.from({
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
  });

  test.strictSame(typeof(Month), 'function');
  test.strictSame(typeof(Month.values), 'object');
  test.strictSame(Array.isArray(Month.values), false);

  test.strictSame(Month.has('May'), true);
  test.strictSame(Month.has('Aug'), false);
  test.strictSame(Month.key('August'), '8');

  const may = new Month('May');
  test.strictSame(typeof(may), 'object');
  test.strictSame(Month.has('May'), true);
  test.strictSame(may.value, '5');

  test.strictSame(may, Month.from('May'));

  test.strictSame(+may, 5);
  test.strictSame(may + '', '5');

  test.end();
});

api.metatests.test('Enum hundreds keys', (test) => {
  const Hundreds = Enum.from(100, 200, 300, 400, 500);

  const h100 = new Hundreds(100);
  const h200 = new Hundreds(200);
  const h500 = new Hundreds(500);

  const errorMessage =
    (val) => `No such enum value ${val}, valid values: 100,200,300,400,500`;
  test.throws(() => new Hundreds(-1), new TypeError(errorMessage(-1)));
  test.throws(() => new Hundreds(0), new TypeError(errorMessage(0)));
  test.throws(() => new Hundreds(600), new TypeError(errorMessage(600)));
  test.throws(
    () => new Hundreds('Hello'),
    new TypeError(errorMessage('Hello'))
  );

  test.strictSame(typeof(Hundreds), 'function');
  test.strictSame(typeof(Hundreds.values), 'object');
  test.strictSame(Array.isArray(Hundreds.values), true);
  test.strictSame(Hundreds.values.length, 5);

  test.strictSame(+h100, 0);
  test.strictSame(h100 + '', '0');
  test.strictSame(h100.keyValue, 100);

  test.strictSame(+h200, 1);
  test.strictSame(h200 + '', '1');
  test.strictSame(h200.keyValue, 200);

  test.strictSame(+h500, 4);
  test.strictSame(h500 + '', '4');
  test.strictSame(h500.keyValue, 500);

  test.strictSame(h100, Hundreds.from(100));
  test.strictSame(h200, Hundreds.from(200));
  test.strictSame(h500, Hundreds.from(500));

  test.end();
});

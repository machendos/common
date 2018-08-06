'use strict';

class Enum {}

const enumArray = values => {
  const keysIndex = new Map();
  const enumValues = new Map();
  for (let i = 0; i < values.length; ++i) {
    keysIndex.set(values[i], i);
  }
  const enumClass = class extends Enum {
    constructor(val) {
      super();
      this.keyValue = val;
      this.value = this.constructor.key(val);
      if (this.value === undefined) {
        throw new TypeError(
          `No such enum value ${val}, valid values: ${values}`
        );
      }
    }
    static from(val) {
      if (!enumValues.has(val)) {
        throw new TypeError(
          `No such enum value ${val}, valid values: ${values}`
        );
      }
      return enumValues.get(val);
    }
    static get values() {
      return values;
    }
    static has(val) {
      return keysIndex.has(val);
    }
    static key(val) {
      return keysIndex.get(val);
    }
    [Symbol.toPrimitive]() {
      return this.value;
    }
  };
  for (let i = 0; i < values.length; ++i) {
    const value = values[i];
    // eslint-disable-next-line new-cap
    enumValues.set(value, new enumClass(value));
  }
  return enumClass;
};

const enumCollection = values => {
  const index = new Map();
  const enumValues = new Map();
  for (const key in values) {
    index.set(values[key], key);
  }
  const enumClass = class extends Enum {
    constructor(val) {
      super();
      this.keyValue = val;
      this.value = this.constructor.key(val);
      if (this.value === undefined) {
        throw new TypeError(
          `No such enum value ${val}, valid values: ${Object.values(values)}`
        );
      }
    }
    static from(val) {
      if (!enumValues.has(val)) {
        throw new TypeError(
          `No such enum value ${val}, valid values: ${Object.values(values)}`
        );
      }
      return enumValues.get(val);
    }
    static get values() {
      return values;
    }
    static has(val) {
      return index.has(val);
    }
    static key(val) {
      return index.get(val);
    }
    [Symbol.toPrimitive](hint) {
      return hint === 'number' ? parseInt(this.value, 10) : this.value;
    }
  };
  for (const key in values) {
    const value = values[key];
    // eslint-disable-next-line new-cap
    enumValues.set(value, new enumClass(value));
  }
  return enumClass;
};

Enum.from = (...args) => {
  const item = args[0];
  const itemType = typeof(item);
  if (itemType === 'object') return enumCollection(item);
  if (itemType !== 'string') return enumArray(args);
  return enumCollection(Object.assign({}, args));
};

module.exports = { Enum };

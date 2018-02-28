'use strict';

class Iterator {
  constructor(base) {
    if (base[Symbol.iterator]) {
      this.base = base[Symbol.iterator]();
    } else if (base.next) {
      this.base = base;
    } else {
      throw new TypeError('Base is neither Iterator nor Iterable');
    }
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    return this.base.next();
  }

  forEach(fn, thisArg) {
    for (const value of this) {
      fn.call(thisArg, value);
    }
  }

  map(mapper, thisArg) {
    // eslint-disable-next-line no-use-before-define
    return new MapIterator(this, mapper, thisArg);
  }

  filter(predicate, thisArg) {
    // eslint-disable-next-line no-use-before-define
    return new FilterIterator(this, predicate, thisArg);
  }

  each(predicate, thisArg) {
    for (const value of this) {
      if (!predicate.call(thisArg, value)) {
        return false;
      }
    }
    return true;
  }

  find(predicate, thisArg) {
    for (const value of this) {
      if (predicate.call(thisArg, value)) {
        return value;
      }
    }
  }

  includes(element) {
    for (const value of this) {
      if (value === element) {
        return true;
      }
    }
    return false;
  }

  reduce(reducer, initialValue) {
    let result = initialValue;

    if (result === undefined) {
      const next = this.next();
      if (next.done) {
        throw new TypeError(
          'reduce of consumed iterator with no initial value'
        );
      }
      result = next.value;
    }

    for (const value of this) {
      result = reducer(result, value);
    }
    return result;
  }

  some(predicate, thisArg) {
    for (const value of this) {
      if (predicate.call(thisArg, value)) {
        return true;
      }
    }
    return false;
  }

  collectTo(CollectionClass) {
    return new CollectionClass(...this);
  }
}

class MapIterator extends Iterator {
  constructor(base, mapper, thisArg) {
    super(base);
    this.mapper = mapper;
    this.thisArg = thisArg;
  }

  next() {
    const { done, value } = this.base.next();
    return {
      done,
      value: done ? undefined : this.mapper.call(this.thisArg, value),
    };
  }
}

class FilterIterator extends Iterator {
  constructor(base, predicate, thisArg) {
    super(base);
    this.predicate = predicate;
    this.thisArg = thisArg;
  }

  next() {
    for (const value of this.base) {
      if (this.predicate.call(this.thisArg, value)) {
        return { done: false, value };
      }
    }
    return { done: true, value: undefined };
  }
}

module.exports = {
  Iterator,
};

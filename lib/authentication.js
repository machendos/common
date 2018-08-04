'use strict';

const MAX_PASS_LENGTH = 128;
const MIN_PASS_LENGTH = 10;
const MIN_PHRASE_LENGTH = 20;
const MIN_OPTIONAL_TESTS = 4;

const passRequiredTests = [
  password => {
    if (password.length < MIN_PASS_LENGTH) {
      return `The password must be longer than ${MIN_PASS_LENGTH} characters`;
    } else if (password.length > MAX_PASS_LENGTH) {
      return `The password must be less than ${MAX_PASS_LENGTH} characters`;
    }
  },

  password => {
    if (/(.)\1{2,}/.test(password)) {
      return 'The password can not contain a sequence of repeated chars';
    }
  }
];

const passOptionalTests = [
  password => {
    if (!/[a-z]/.test(password)) {
      return 'The password must contain lowercase char';
    }
  },

  password => {
    if (!/[A-Z]/.test(password)) {
      return 'The password must contain uppercase char';
    }
  },

  password => {
    if (!/[0-9]/.test(password)) {
      return 'The password must contain number';
    }
  },

  password => {
    if (!/[^A-Za-z0-9]/.test(password)) {
      return 'The password must contain special char';
    }
  }
];

const loginTests = [

];

const loginPasswordTests = [
  (login, password) => {
    if (login.includes(password)) {
      return 'The login can not contain a password';
    } else if (password.includes(login)) {
      return 'The password can not contain a login';
    }
  }
];

const createResult = (valid, hints, strength) => (
  new (class AuthenticationStrength {
    constructor() {
      this.hints = hints;
    }

    get valid() { return valid; }
    get strength() { return strength; }
  })()
);

const makeTest = (tests, ...testData) => {
  const hints = [];
  tests.forEach(test => {
    const hint = test(...testData);
    if (hint) hints.push(hint);
  });
  return hints;
};

const checkPassword = password => {
  const hints = {
    password: {
      required: makeTest(passRequiredTests, password),
      optional: makeTest(passOptionalTests, password)
    }
  };

  const valid = !hints.password.required.length;
  const strength = password.length >= MIN_PHRASE_LENGTH ||
    hints.password.optional.length < MIN_OPTIONAL_TESTS;

  return createResult(valid, hints, strength);
};

const checkLogin = login => {
  const hints = { login: makeTest(loginTests, login) };
  const valid = !hints.login.length;
  return createResult(valid, hints);
};

const checkLoginPassword = (login, password) => {
  const hints = {
    login: makeTest(loginTests, login),
    password: {
      required: makeTest(passRequiredTests, password),
      optional: makeTest(passOptionalTests, password)
    },
    loginPassword: makeTest(loginPasswordTests, login, password)
  };

  const loginValid = !hints.login.length;
  const passValid = !hints.password.required.length;
  const strength = password.length >= MIN_PHRASE_LENGTH ||
    hints.password.optional.length < MIN_OPTIONAL_TESTS;

  const valid = loginValid && passValid;

  return createResult(valid, hints, strength);
};

module.exports = {
  checkLogin,
  checkPassword,
  checkLoginPassword
};

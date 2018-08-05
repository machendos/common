'use strict';

const MAX_PASS_LENGTH = 128;
const MIN_PASS_LENGTH = 10;
const MIN_PHRASE_LENGTH = 20;
const MIN_OPTIONAL_TESTS = 3;

const MIN_LOGIN_LENGTH = 3;
const MAX_LOGIN_LENGTH = 30;

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
  login => {
    if (login.length < MIN_LOGIN_LENGTH) {
      return `The login must be longer than ${MIN_LOGIN_LENGTH} characters`;
    } else if (login.length > MAX_LOGIN_LENGTH) {
      return `The login must be less than ${MAX_LOGIN_LENGTH} characters`;
    }
  },

  login => {
    if (!/^[a-zA-Z0-9_-]*$/.test(login)) {
      return 'The login can consist of alphanumeric characters, "_" and "-"';
    }
  },

  login => {
    if (login.startsWith('_') || login.startsWith('-') ||
      login.endsWith('_') || login.endsWith('-')) {
      return 'The login cannot have a "_" or "-" at the start or end';
    }
  },

  login => {
    if (login.includes('__') || login.includes('--')) {
      return 'The login can not contain a sequence of repeated "_" or "-"';
    }
  }
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

const createResult = hints => (
  new (class AuthenticationStrength {
    get hints() { return hints; }
    get valid() {
      return hints.login ? !hints.login.length : true &&
      hints.password ? !hints.password.required.length : true &&
      hints.loginPassword ? !hints.loginPassword.length : true;
    }
    get strength() {
      return hints.password.optional.length <= MIN_OPTIONAL_TESTS;
    }
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

const checkLogin = login => (
  createResult({
    login: makeTest(loginTests, login)
  })
);

const checkPassword = password => (
  createResult({
    password: {
      required: makeTest(passRequiredTests, password),
      optional: password.length <= MIN_PHRASE_LENGTH ?
        makeTest(passOptionalTests, password) : []
    }
  })
);

const checkLoginPassword = (login, password) => (
  createResult({
    login: makeTest(loginTests, login),
    password: {
      required: makeTest(passRequiredTests, password),
      optional: password.length <= MIN_PHRASE_LENGTH ?
        makeTest(passOptionalTests, password) : []
    },
    loginPassword: makeTest(loginPasswordTests, login, password)
  })
);

module.exports = {
  checkLogin,
  checkPassword,
  checkLoginPassword
};

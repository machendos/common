'use strict';

const MAX_PASS_LENGTH = 128;
const MIN_PASS_LENGTH = 10;
const MIN_PHRASE_LENGTH = 20;

const MIN_LOGIN_LENGTH = 6;
const MAX_LOGIN_LENGTH = 255;

const passwordTests = {
  MIN_LENGTH: [
    password => password.length < MIN_PASS_LENGTH,
    `The password must be longer than ${MIN_PASS_LENGTH} characters`
  ],
  MAX_LENGTH: [
    password => password.length > MAX_PASS_LENGTH,
    `The password must be less than ${MAX_PASS_LENGTH} characters`
  ],
  MIN_PHRASE_LENGTH: [
    password => password.length < MIN_PHRASE_LENGTH,
    `The passphrase must be longer than ${MIN_PHRASE_LENGTH} characters`
  ],
  REPEAT_CHARS: [
    password => /(.)\1{2,}/.test(password),
    'The password can not contain a sequence of repeated chars'
  ],
  ONE_LOWERCASE_CHAR: [
    password => !/[a-z]/.test(password),
    'The password must contain lowercase char'
  ],
  ONE_UPPERERCASE_CHAR: [
    password => !/[A-Z]/.test(password),
    'The password must contain uppercase char'
  ],
  ONE_NUMBER: [
    password => !/[0-9]/.test(password),
    'The password must contain number'
  ],
  ONE_SPECIAL_CHAR: [
    password => !/[^A-Za-z0-9]/.test(password),
    'The password must contain special char'
  ]
};

const loginTests = {
  MIN_LENGTH: [
    login => login.length < MIN_LOGIN_LENGTH,
    `The login must be longer than ${MIN_LOGIN_LENGTH} characters`
  ],
  MAX_LENGTH: [
    login => login.length > MAX_LOGIN_LENGTH,
    `The login must be less than ${MAX_LOGIN_LENGTH} characters`
  ]
};

const loginPasswordTests = {
  LOGIN_INCLUDES_PASSWORD: [
    (login, password) => login.includes(password),
    'The login can not contain a password'
  ],
  PASSWORD_INCLUDES_LOGIN: [
    (login, password) => password.includes(login),
    'The password can not contain a login'
  ]
};

class AuthenticationStrength {
  constructor(requiredHints, optionalHints = []) {
    this.hints = {
      required: requiredHints,
      optional: optionalHints
    };
  }
  get valid() {
    return !this.hints.required.length;
  }
  get strength() {
    return !this.hints.optional.length;
  }
}

const makeTest = (
  tests,
  requiredTestsNames,
  optionalTestsNames,
  ...testArgm
) => {
  const testLogicalGroup = testGroup => {
    const testGroupHints = [];
    testGroup.forEach(testName => {
      if (tests[testName]) {
        const [test, hint] = tests[testName];
        if (test(...testArgm)) testGroupHints.push(hint);
      }
    });
    return testGroupHints;
  };

  const test = testsNames => {
    const testsHints = [];
    for (const testGroup of testsNames) {
      const testGroupHints = testLogicalGroup(testGroup);
      if (testGroupHints.length) testsHints.push(testGroupHints);
      else return [];
    }
    return testsHints;
  };

  const requiredHints = test(requiredTestsNames);
  const optionalHints = test(optionalTestsNames);

  return new AuthenticationStrength(requiredHints, optionalHints);
};


const checkLogin = (
  login,
  reqTestsNames,
  optTestsNames = []
) => (
  makeTest(loginTests, reqTestsNames, optTestsNames, login)
);

const checkPassword = (
  password,
  reqTestsNames,
  optTestsNames = []
) => (
  makeTest(passwordTests, reqTestsNames, optTestsNames, password)
);

const checkLoginPassword = (
  login,
  password,
  reqTestsNames,
  optTestsNames = []
) => (
  makeTest(loginPasswordTests, reqTestsNames, optTestsNames, login, password)
);

module.exports = {
  checkLogin,
  checkPassword,
  checkLoginPassword
};

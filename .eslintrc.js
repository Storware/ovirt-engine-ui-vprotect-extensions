module.exports = {
  env: {
    browser: true,
    jest: true,
  },
  globals: {
    __DEV__: false,
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended"
  ]
};

module.exports = {
  'extends': [
    'standard',
    'standard-react'
  ],
  'env': {
    'browser': true,
    'jest': true
  },
  'globals': {
    '__DEV__': false
  },
  'plugins': [
    'chai-friendly'
  ],
  'rules': {
    'no-multi-spaces': ['error', {
      'ignoreEOLComments': true
    }],
    // disable original no-unused-expressions rule and use chai-friendly replacement
    'no-unused-expressions': 'off',
    'chai-friendly/no-unused-expressions': 'error'
  }
}

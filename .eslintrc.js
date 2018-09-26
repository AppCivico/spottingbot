
// Configuration
module.exports = {

  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2016,
    ecmaFeatures: {
      globalReturn: false,
      impliedStrict: false,
      jsx: true,
    },
    allowImportExportEverywhere: false,
  },

  env: {
    browser: false,
    es6: true,
    node: true,
  },

  extends: [
    'strongloop',
    // 'plugin:node/recommended', // ES6 not supported yet, define which files are in node
  ],

  plugins: [
    'promise',
  ],

  settings: {

  },

  // Note: 0 = off, 1 = warn, 2 = error
  rules: {

    // Eslint parameters
    'padded-blocks': [2, {
      blocks: 'never',
      classes: 'never',
      switches: 'never'
    }],
    'no-multiple-empty-lines': [1, {'max': 1, 'maxEOF': 1, 'maxBOF': 0}],
    'no-unused-vars': 1,
    'require-jsdoc': 0,
    'max-len': [0, 100, 4],
    'arrow-parens': 1,
    'generator-star-spacing': 1,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'space-before-function-paren': [2, {
      anonymous: 'always',
      named: 'never',
    }],
    'new-cap': 1,
    'no-empty': 1,
    'no-invalid-this': 2,
  },
};

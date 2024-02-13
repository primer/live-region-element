'use strict'

/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:github/recommended',
    'plugin:github/browser',
    'plugin:github/typescript',
  ],
  settings: {},
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
      },
    ],
    'import/no-unresolved': 'off',
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        'filenames/match-regex': 'off',
        'import/no-namespace': 'off',
        '@typescript-eslint/no-namespace': 'off',
      },
    },
    {
      files: ['*.test.ts'],
      rules: {
        'github/no-inner-html': 'off',
        'i18n-text/no-en': 'off',
      },
    },
  ],
}

module.exports = config

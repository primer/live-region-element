import js from '@eslint/js'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import github from 'eslint-plugin-github'

export default [
  {
    ignores: ['dist/**', 'out/**', '.next/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': tseslint,
      github,
    },
    languageOptions: {
      parser: tsparser,
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        CustomEvent: 'readonly',
        HTMLElement: 'readonly',
        HTMLTemplateElement: 'readonly',
        Element: 'readonly',
        customElements: 'readonly',
        // Node globals
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        // ES6 globals
        Promise: 'readonly',
        Symbol: 'readonly',
        Map: 'readonly',
        Set: 'readonly',
        WeakMap: 'readonly',
        WeakSet: 'readonly',
      },
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      'no-unused-vars': 'off',
      'import/no-unresolved': 'off',
      'eslint-comments/no-use': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'filenames/match-regex': 'off',
      'import/no-namespace': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/*.test.ts'],
    rules: {
      'github/no-inner-html': 'off',
      'i18n-text/no-en': 'off',
    },
  },
  {
    files: ['website/**/*.ts', 'website/**/*.tsx'],
    languageOptions: {
      globals: {
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    rules: {
      'i18n-text/no-en': 'off',
    },
  },
]

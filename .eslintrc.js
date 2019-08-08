const path = require('path');

module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['airbnb', 'prettier', 'prettier/react'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': [
      'error',
      {
        devDependencies: [
          'scripts/**/*.js',
          'rollup.*',
          '*.config.js',
          '**/__tests__/**/*',
        ],
      },
    ],
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/label-has-for': 0,
    'no-param-reassign': 0,
    'no-plusplus': 0,
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
    ],
    'react/no-unknown-property': 0,
  },
  settings: {
    'import/core-modules': ['redux-zero'],
    'import/resolver': {
      'eslint-import-resolver-lerna': {
        packages: path.resolve(__dirname, 'packages'),
      },
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
    react: {
      pragma: 'h',
    },
  },
  overrides: [
    {
      files: ['packages/core/**/*'],
      settings: {
        'import/core-modules': ['redux-zero'],
      },
    },
    {
      files: ['**/*.test.*'],
      env: {
        jest: true,
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.base.json',
      },
      plugins: ['@typescript-eslint'],
      rules: {
        '@typescript-eslint/no-non-null-assertion': 0,
        '@typescript-eslint/no-unused-vars': 'error',
        'no-empty-function': 0,
        'no-unused-vars': 0,
        'no-useless-constructor': 0,
      },
    },
  ],
};

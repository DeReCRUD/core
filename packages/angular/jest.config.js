const baseConfig = require('../../jest.config');

module.exports = {
  ...baseConfig,
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleNameMapper: {
    '@de-re-crud/(.*)': '<rootDir>/../../packages/$1/src',
  },
};

const { pathsToModuleNameMapper } = require('ts-jest')

const tsconfig = require('./tsconfig.json')

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  coveragePathIgnorePatterns: ['/node_modules/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules'],
  modulePathIgnorePatterns: ['/build/', '/lib/', '/dist/', '/es/'],
  testRegex: 'src/.*.(test|spec).(jsx?|tsx?)?$',
  collectCoverage: false,
  coverageDirectory: 'test-results/code-coverage',
  coverageReporters: ['clover', 'json', 'lcov', 'text', 'cobertura'],
  globals: {},
  moduleNameMapper: {
    ...pathsToModuleNameMapper(tsconfig.compilerOptions.paths),
  },
}

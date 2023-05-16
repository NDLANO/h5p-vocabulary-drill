/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  transform: {
    '.ts': [
      'ts-jest',
      {
        // Use separate tsconfig for tests as ts-node doesn't work well with `verbatimModuleSyntax` in cjs projects
        // https://github.com/kulshekhar/ts-jest/issues/4081#issuecomment-1515758013
        tsconfig: './tsconfig.jest.json',
      },
    ],
  },
};

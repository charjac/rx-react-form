module.exports = {
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/index.ts',
    '!src/components/**',
    '!src/utils/**',
    '!src/**/*.test.{ts, tsx}',
    '!src/**/types.ts',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'jsx', 'json', 'ts', 'tsx'],
  setupFiles: ['raf/polyfill', './test-setup.js'],
  testMatch: ['**/__tests__/*.(ts|tsx|js)'],
  testPathIgnorePatterns: ['<rootDir>/build/', '<rootDir>/node_modules/'],
  transform: {
    '.(js|jsx)': '<rootDir>/node_modules/babel-jest',
    '.(ts|tsx)': '<rootDir>/node_modules/ts-jest/preprocessor.js',
  },
}

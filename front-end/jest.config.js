module.exports = {
    testEnvironment: 'jest-environment-jsdom',

    setupFilesAfterEnv: ['<rootDir>/src/app/tests/setupTests.js'],
    
    transform: {
        '^.+\\.jsx?$': ['babel-jest', { configFile: './.babelrc.test.json' }],
    },
    transformIgnorePatterns: [
      'node_modules/(?!(@emotion/react|@emotion/styled))'
    ],

    // Ensure that css files are not loaded during tests
    moduleNameMapper: {
        '\\.(css|less|scss)$': '<rootDir>/src/__mocks__/styleMock.js', 
      },
  };
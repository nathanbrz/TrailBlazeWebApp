module.exports = {
    testEnvironment: 'node',
    verbose: true,
    testPathIgnorePatterns: ['/node_modules/'],
    coverageDirectory: 'coverage',
    collectCoverageFrom: [
        'controllers/**/*.js',
        'dbmodels/**/*.js',
        'middleware/**/*.js',
        'routes/**/*.js',
        'services/**/*.js'
    ],
    setupFilesAfterEnv: ['./testSetup/setupTests.js'],
    testTimeout: 30000
};

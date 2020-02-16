module.exports = {
  transform: { '\\.ts$': 'ts-jest' },
  testEnvironment: 'node', // Needs to be confirmed
  // testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  testRegex: '\\.spec\\.ts$',
  moduleFileExtensions: ['ts', 'js'],
};

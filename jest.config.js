module.exports = {
  'roots': [
    '<rootDir>/server',
    '<rootDir>/client',
    '<rootDir>/test'
  ],
  'transform': { '^.+\\.tsx?$': 'ts-jest' },
  'testRegex': '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  'moduleFileExtensions': [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node'
  ]
}

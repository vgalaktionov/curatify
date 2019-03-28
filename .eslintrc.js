module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'standard', 'standard-react'
  ],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'semi': ['error', 'never'],
    "object-curly-spacing": ["error", "always"],
    "max-len": ["error", {
      "code": 100
    }],
    "comma-dangle": ["error", "never"],
    "comma-spacing": "error",
    "object-curly-newline": ["error", {
      "multiline": true,
      "minProperties": 5
    }],
    // "object-curly-newline": 0,
    "no-return-await": "error",
    "no-undef": "error",
    "react/prop-types": 0,
    "template-tag-spacing": 0,
    "camelcase": ["error", {"properties": "never", "ignoreDestructuring": true}]
  }
}

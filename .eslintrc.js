module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    'plugin:vue/recommended'
  ],
  // required to lint *.vue files
  plugins: [
    'vue'
  ],
  // add your custom rules here
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'semi': ['error', 'never'],
    "object-curly-spacing": ["error", "always"],
    "max-len": ["error", {"code": 100}],
    "comma-dangle": ["error", "never"],
    "comma-spacing": "error",
    "object-curly-newline": ["error", {
      "multiline": true,
      "minProperties": 5
    }],
    "no-return-await": "error",
    "no-undef": "error",
    "vue/max-attributes-per-line": ["error", {
      "singleline": 3,
      "multiline": {
        "max": 1,
        "allowFirstLine": false
      }
    }]
  }
}

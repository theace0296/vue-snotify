/** @type {import('eslint').ESLint.ConfigData} */
module.exports = {
  env: {
    browser: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  root: true,
  overrides: [
    {
      parserOptions: { project: null },
      files: ['*.js', '**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
  ],
  rules: {
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/member-delimiter-style': [
      'error',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true,
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false,
        },
      },
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
        leadingUnderscore: 'forbid',
        trailingUnderscore: 'forbid',
      },
    ],
    '@typescript-eslint/prefer-namespace-keyword': 'off',
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/semi': 'error',
    '@typescript-eslint/type-annotation-spacing': 'error',
    'brace-style': ['error', '1tbs'],
    eqeqeq: ['error', 'smart'],
    'id-denylist': [
      'error',
      'any',
      'Number',
      'number',
      'String',
      'string',
      'Boolean',
      'boolean',
      'Undefined',
      'undefined',
    ],
    'id-match': 'error',
    indent: 'off',
    'no-eval': 'error',
    'no-redeclare': 'error',
    'no-trailing-spaces': 'off',
    'no-underscore-dangle': 'error',
    'no-var': 'error',
    quotes: 'off',
    semi: 'off',
    'spaced-comment': [
      'error',
      'always',
      {
        markers: ['/'],
      },
    ],
  },
};

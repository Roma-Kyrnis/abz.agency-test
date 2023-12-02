export default {
  root: true,
  env: {
    es2024: true,
    node: true,
    mysql: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['prettier', '@typescript-eslint/eslint-plugin', 'simple-import-sort'],
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  ignorePatterns: ['/bin/', '/lib/', '/out/', '.eslintrc.js'],
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/camelcase': 'off',
    '@typescript-eslint/interface-name-prefix': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-use-before-define': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    'simple-import-sort/imports': 'error',
    // https://github.com/microsoft/TypeScript/issues/18433
    'no-restricted-globals': [
      'error',
      'closed',
      'event',
      'fdescribe',
      'length',
      'location',
      'name',
      'parent',
      'top',
    ],
  },
  overrides: [
    {
      files: ['src/**/*.?(m)js'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['test/**/*.ts'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
  ],
};

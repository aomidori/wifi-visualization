module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh', 'react'],
  rules: {
    'no-unused-vars': 'off',
    'quotes': [2, 'single'],
    'indent': [2, 2, {
      switchCase: 1,
    }],
    '@typescript-eslint/no-unused-vars': ['off'],
    'semi': ['error', 'always'],
    'react-refresh/only-export-components': [
      'off',
      { allowConstantExport: true },
    ],
    'react-hooks/exhaustive-deps': 'off',
    'sort-imports': ['error', {
      ignoreDeclarationSort: true,
      memberSyntaxSortOrder: ['none', 'all', 'single', 'multiple'],
    }],
    'react/jsx-indent': [2, 2],
    'react/jsx-indent-props': [2, 2],
    'react/no-unknown-property': 'off',
    'react/react-in-jsx-scope': 'off',
  },
}

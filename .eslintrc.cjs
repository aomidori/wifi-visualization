module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: [
    'react-refresh',
    'react',
    '@typescript-eslint',
    'import',
  ],
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: true
    },
  },
  rules: {
    'no-unused-vars': 'off',
    'quotes': [2, 'single'],
    'indent': [2, 2],
    '@typescript-eslint/no-unused-vars': ['off'],
    'semi': ['error', 'always'],
    'react-refresh/only-export-components': [
      'off',
      { allowConstantExport: true },
    ],
    'react-hooks/exhaustive-deps': 'off',
    'sort-imports': ['error', {
      ignoreDeclarationSort: true,
      ignoreMemberSort: false,
      allowSeparatedGroups: true,
      memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
    }],
    'import/order': ['error', {
      'groups': ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
    }],
    'react/jsx-indent': [2, 2],
    'react/jsx-indent-props': [2, 2],
    'react/no-unknown-property': 'off',
    'react/react-in-jsx-scope': 'off',
  },
}

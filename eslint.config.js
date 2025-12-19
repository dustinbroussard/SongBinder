const js = require('@eslint/js');
const importPlugin = require('eslint-plugin-import');

module.exports = [
  {
    ignores: ['lib/**', 'assets/**', '**/*.min.js'],
  },
  js.configs.recommended,
  {
    plugins: { import: importPlugin },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'script',
      globals: {
        idb: 'readonly',
        Fuse: 'readonly',
        Sortable: 'readonly',
        mammoth: 'readonly',
        Tesseract: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-console': 'off',
      'import/no-unresolved': 'off',
      'import/no-absolute-path': 'off',
    },
  },
];

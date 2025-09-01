import js from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  { ignores: ['node_modules', 'dist', 'build', 'coverage'] },
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.mjs'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      // Node global'ları (eslint'e "bunlar var" de)
      globals: { console: 'readonly', process: 'readonly' },
    },
    rules: {
      'no-console': 'warn',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  eslintConfigPrettier,
];

import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginImport from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import { defineConfig } from 'eslint/config';
import eslint from '@eslint/js';
import tsparser from '@typescript-eslint/parser';
import js from '@eslint/js';

export default defineConfig([
  js.configs.recommended,
  eslint.configs.recommended,
  tseslint.configs.recommended,
  react.configs.flat.recommended,
  reactHooks.configs.flat.recommended,
  {
    files: ['src/**/*.{mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: ['./tsconfig.json'],
      },
      globals: globals.browser,
    },

    plugins: {
      react: react,
      import: pluginImport,
    },
    rules: {
      'react/react-in-jsx-scope': 'off',

      'import/order': 'error',
      'import/no-unresolved': 'error',
      'import/named': 'error',
      'import/default': 'error',
      'import/no-restricted-paths': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
]);

import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import vue from 'eslint-plugin-vue';
import prettier from 'eslint-plugin-prettier';
import vueParser from 'vue-eslint-parser';
import globals from 'globals';

const tsRecommended = tsPlugin.configs.recommended ?? {};
const vueRecommended = vue.configs['vue3-recommended'] ?? {};
const prettierRecommended = prettier.configs?.recommended ?? {};

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.vitepress/cache/**',
      '.vitepress/dist/**',
      '.vitepress/.temp/**',
      'public/**',
      '_*.json',
    ],
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier,
    },
    rules: {
      ...(tsRecommended.rules ?? {}),
      ...(prettierRecommended.rules ?? {}),
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-floating-promises': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': tsPlugin,
      prettier,
    },
    rules: {
      ...(vueRecommended.rules ?? {}),
      ...(prettierRecommended.rules ?? {}),
      'vue/multi-word-component-names': 'off',
    },
  },
];

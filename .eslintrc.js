module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'jsx-a11y',
  ],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'warn',
    'no-unused-vars': ['warn', { 
      varsIgnorePattern: '^_',
      argsIgnorePattern: '^_',
      ignoreRestSiblings: true 
    }],
    'no-console': 'warn',
    'jsx-a11y/anchor-is-valid': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
    'build/',
    'node_modules/',
    'coverage/',
    'dist/',
    'public/',
  ],
  globals: {
    jest: 'readonly',
  },
};
// eslint-disable-next-line no-unused-vars
const actionTypes = {
  FETCH_DATA: 'FETCH_DATA',
  SET_LOADING: 'SET_LOADING',
};

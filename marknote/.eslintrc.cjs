module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    '@electron-toolkit/eslint-config-ts/recommended',
    '@electron-toolkit/eslint-config-prettier'
  ],
  rules: {
    // TypeScript 相关规则
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': 'warn', // 建议改为 warning 而不是完全关闭

    // React 相关规则优化
    'react/prop-types': 'off', // TypeScript 项目中可以关闭
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',

    // 其他实用规则
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',

    // 代码风格建议（与 Prettier 配合）
    'arrow-parens': ['error', 'as-needed'],
    'prefer-const': 'warn'
  },
  settings: {
    react: {
      version: 'detect' // 自动检测 React 版本
    }
  },
  env: {
    browser: true,
    node: true,
    es2021: true
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 'latest',
    sourceType: 'module'
  }
}

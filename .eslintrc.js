module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: "detect",
    },
  },
  env: {
    node: true,
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
  ],
  rules: {
    "@typescript-eslint/interface-name-prefix": ["off"],
    "@typescript-eslint/explicit-function-return-type": ["off"],
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/no-inferrable-types": ["off"],
    "@typescript-eslint/explicit-module-boundary-types": ["off"],
    "@typescript-eslint/camelcase": ["off"],
    "@typescript-eslint/no-unused-vars": ["error", { ignoreRestSiblings: true }],
    "no-console": 2,
    "lines-between-class-members": ["error", "always", { exceptAfterSingleLine: true }],
    "prettier/prettier": ["error", { endOfLine: "auto" }],
    "@typescript-eslint/no-floating-promises": ["error"],
  },
  overrides: [
    {
      files: ["packages/**/*.test.ts", "packages/**/*.test.tsx"],
      env: {
        jest: true,
      },
    },
    {
      files: ["*.js"],
      rules: {
        "@typescript-eslint/no-var-requires": ["off"],
        "@typescript-eslint/no-empty-function": ["off"],
      },
    },
  ],
};

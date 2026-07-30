// Minimal flat config (ESLint 9): enough to lint the JSX/ESM sources for real.
import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  js.configs.recommended,
  {
    files: ["src/**/*.{js,jsx}"],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "module",
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        document: "readonly",
        setInterval: "readonly",
        clearInterval: "readonly",
      },
    },
    rules: {
      // Core eslint has no notion that a JSX element "uses" the identifiers
      // it references (that's what these two rules from eslint-plugin-react
      // are for), so without them `no-unused-vars` misflags every component
      // import and the `React` import every JSX file needs in scope.
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
    },
  },
  {
    files: ["**/*.test.js"],
    languageOptions: {
      globals: {
        test: "readonly",
        expect: "readonly",
        jest: "readonly",
        describe: "readonly",
      },
    },
  },
  {
    files: ["babel.config.js", "jest.config.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { module: "readonly", require: "readonly" },
    },
  },
  {
    ignores: ["dist/", "node_modules/"],
  },
];

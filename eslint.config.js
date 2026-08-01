// ESLint 9 flat config: lints JSX/ESM sources with React support and environment-specific globals.
import js from "@eslint/js";
import react from "eslint-plugin-react";

export default [
  // Base ESLint recommended rules
  js.configs.recommended,

  // Source files: JSX support with browser globals and React rules
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

  // Test files: Jest globals
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

  // Config files: CommonJS environment with Node.js globals
  {
    files: ["babel.config.js", "jest.config.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: { module: "readonly", require: "readonly" },
    },
  },

  // Ignore patterns
  {
    ignores: ["dist/", "node_modules/"],
  },
];

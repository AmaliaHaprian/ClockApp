/**
 * Tests for eslint.config.js - validates ESLint 9 flat config format
 * and proper linting rule application across file patterns.
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Run ESLint on a specific file and return the result.
 * Returns { exitCode, stdout, stderr }
 */
function runEslint(filePath) {
  return new Promise((resolve) => {
    const eslint = spawn("npx", ["eslint", filePath], {
      cwd: __dirname,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";

    eslint.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    eslint.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    eslint.on("close", (code) => {
      resolve({ exitCode: code, stdout, stderr });
    });
  });
}

describe("eslint.config.js", () => {
  describe("Format and Structure", () => {
    test("Configuration file is importable and exports an array", async () => {
      const config = (await import("./eslint.config.js")).default;
      expect(Array.isArray(config)).toBe(true);
      expect(config.length).toBeGreaterThan(0);
    });

    test("Config includes base ESLint recommended rules", async () => {
      const config = (await import("./eslint.config.js")).default;
      const hasRecommended = config.some((c) => c.rules && typeof c.rules === "object");
      expect(hasRecommended).toBe(true);
    });
  });

  describe("File Pattern Matching", () => {
    test("Config includes src JSX file pattern matcher", async () => {
      const config = (await import("./eslint.config.js")).default;
      const srcJsxConfig = config.find(
        (c) => c.files && c.files.includes("src/**/*.{js,jsx}")
      );
      expect(srcJsxConfig).toBeDefined();
    });

    test("Config includes test file pattern matcher", async () => {
      const config = (await import("./eslint.config.js")).default;
      const testConfig = config.find((c) => c.files && c.files.includes("**/*.test.js"));
      expect(testConfig).toBeDefined();
    });

    test("Config includes config file pattern matcher", async () => {
      const config = (await import("./eslint.config.js")).default;
      const configFileConfig = config.find(
        (c) =>
          c.files &&
          (c.files.includes("babel.config.js") || c.files.includes("jest.config.js"))
      );
      expect(configFileConfig).toBeDefined();
    });
  });

  describe("React Plugin Integration", () => {
    test("React plugin is registered for src JSX files", async () => {
      const config = (await import("./eslint.config.js")).default;
      const srcJsxConfig = config.find(
        (c) => c.files && c.files.includes("src/**/*.{js,jsx}")
      );
      expect(srcJsxConfig).toBeDefined();
      expect(srcJsxConfig.plugins).toBeDefined();
      expect(srcJsxConfig.plugins.react).toBeDefined();
    });

    test("React rules are configured for src JSX files", async () => {
      const config = (await import("./eslint.config.js")).default;
      const srcJsxConfig = config.find(
        (c) => c.files && c.files.includes("src/**/*.{js,jsx}")
      );
      expect(srcJsxConfig.rules).toBeDefined();
      expect(srcJsxConfig.rules["react/jsx-uses-react"]).toBe("error");
      expect(srcJsxConfig.rules["react/jsx-uses-vars"]).toBe("error");
    });
  });

  describe("Language Options and Globals", () => {
    test("Src JSX files have correct language options", async () => {
      const config = (await import("./eslint.config.js")).default;
      const srcJsxConfig = config.find(
        (c) => c.files && c.files.includes("src/**/*.{js,jsx}")
      );
      expect(srcJsxConfig.languageOptions).toBeDefined();
      expect(srcJsxConfig.languageOptions.ecmaVersion).toBe(2021);
      expect(srcJsxConfig.languageOptions.sourceType).toBe("module");
      expect(srcJsxConfig.languageOptions.parserOptions).toBeDefined();
      expect(srcJsxConfig.languageOptions.parserOptions.ecmaFeatures).toBeDefined();
      expect(srcJsxConfig.languageOptions.parserOptions.ecmaFeatures.jsx).toBe(true);
    });

    test("Src JSX files have browser globals", async () => {
      const config = (await import("./eslint.config.js")).default;
      const srcJsxConfig = config.find(
        (c) => c.files && c.files.includes("src/**/*.{js,jsx}")
      );
      expect(srcJsxConfig.languageOptions.globals).toBeDefined();
      expect(srcJsxConfig.languageOptions.globals.document).toBe("readonly");
      expect(srcJsxConfig.languageOptions.globals.setInterval).toBe("readonly");
      expect(srcJsxConfig.languageOptions.globals.clearInterval).toBe("readonly");
    });

    test("Test files have Jest globals", async () => {
      const config = (await import("./eslint.config.js")).default;
      const testConfig = config.find((c) => c.files && c.files.includes("**/*.test.js"));
      expect(testConfig).toBeDefined();
      expect(testConfig.languageOptions).toBeDefined();
      expect(testConfig.languageOptions.globals).toBeDefined();
      expect(testConfig.languageOptions.globals.test).toBe("readonly");
      expect(testConfig.languageOptions.globals.expect).toBe("readonly");
      expect(testConfig.languageOptions.globals.jest).toBe("readonly");
      expect(testConfig.languageOptions.globals.describe).toBe("readonly");
    });

    test("Config files have Node.js globals and CommonJS source type", async () => {
      const config = (await import("./eslint.config.js")).default;
      const configFileConfig = config.find(
        (c) =>
          c.files &&
          (c.files.includes("babel.config.js") || c.files.includes("jest.config.js"))
      );
      expect(configFileConfig).toBeDefined();
      expect(configFileConfig.languageOptions).toBeDefined();
      expect(configFileConfig.languageOptions.sourceType).toBe("commonjs");
      expect(configFileConfig.languageOptions.globals).toBeDefined();
      expect(configFileConfig.languageOptions.globals.module).toBe("readonly");
      expect(configFileConfig.languageOptions.globals.require).toBe("readonly");
    });
  });

  describe("Ignore Patterns", () => {
    test("Config includes ignore patterns", async () => {
      const config = (await import("./eslint.config.js")).default;
      const ignoreConfig = config.find((c) => c.ignores);
      expect(ignoreConfig).toBeDefined();
      expect(ignoreConfig.ignores).toBeDefined();
      expect(Array.isArray(ignoreConfig.ignores)).toBe(true);
      expect(ignoreConfig.ignores).toContain("dist/");
      expect(ignoreConfig.ignores).toContain("node_modules/");
    });
  });

  describe("ESLint Validation Against Project Files", () => {
    test("Clock.jsx lints without errors", async () => {
      const result = await runEslint("src/Clock.jsx");
      // Clock.jsx should lint successfully with no new errors from the config
      // Exit code 0 means no linting errors
      expect(result.exitCode).toBe(0);
      expect(result.stdout).not.toMatch(/error/i);
    });

    test("App.jsx lints without errors", async () => {
      const result = await runEslint("src/App.jsx");
      expect(result.exitCode).toBe(0);
      expect(result.stdout).not.toMatch(/error/i);
    });

    test("clock-source.js lints without errors", async () => {
      const result = await runEslint("src/clock-source.js");
      expect(result.exitCode).toBe(0);
      expect(result.stdout).not.toMatch(/error/i);
    });

    test("clock-source.test.js lints without errors", async () => {
      const result = await runEslint("src/clock-source.test.js");
      expect(result.exitCode).toBe(0);
      expect(result.stdout).not.toMatch(/error/i);
    });

    test("babel.config.js lints without errors", async () => {
      const result = await runEslint("babel.config.js");
      expect(result.exitCode).toBe(0);
      expect(result.stdout).not.toMatch(/error/i);
    });

    test("jest.config.js lints without errors", async () => {
      const result = await runEslint("jest.config.js");
      expect(result.exitCode).toBe(0);
      expect(result.stdout).not.toMatch(/error/i);
    });
  });

  describe("React JSX Globals Support", () => {
    test("React imports are not flagged as unused in JSX files", async () => {
      const result = await runEslint("src/App.jsx");
      // App.jsx imports React and uses it in JSX. The react/jsx-uses-react
      // rule should prevent no-unused-vars from flagging it.
      expect(result.exitCode).toBe(0);
      expect(result.stdout).not.toMatch("React");
    });

    test("Browser globals are recognized in src files", async () => {
      const result = await runEslint("src/clock-source.js");
      // clock-source.js uses setInterval and clearInterval which should be
      // recognized as browser globals and not cause undefined variable errors
      expect(result.exitCode).toBe(0);
      expect(result.stdout).not.toMatch(/setInterval|clearInterval/);
    });
  });

  describe("Jest Globals Support", () => {
    test("Jest globals are recognized in test files", async () => {
      const result = await runEslint("src/clock-source.test.js");
      // clock-source.test.js uses test, jest, and expect which are Jest globals
      // They should be recognized and not cause undefined variable errors
      expect(result.exitCode).toBe(0);
      expect(result.stdout).not.toMatch(/test|jest|expect/);
    });
  });
});

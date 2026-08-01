/**
 * Tests for jest.config.js configuration file
 * Validates that Jest configuration adheres to acceptance criteria:
 * - Parses and applies without errors
 * - Maintains Node.js test environment
 * - Preserves build artifact and node_modules exclusions
 * - Adheres to Jest schema standards
 */

describe("jest.config.js", () => {
  let config;

  beforeEach(() => {
    // Reload config fresh for each test
    delete require.cache[require.resolve("./jest.config.js")];
    config = require("./jest.config.js");
  });

  describe("configuration structure", () => {
    test("exports a valid configuration object", () => {
      expect(config).toBeDefined();
      expect(typeof config).toBe("object");
      expect(config).not.toBeNull();
    });

    test("configuration is not a function or class", () => {
      expect(typeof config).not.toBe("function");
      expect(config.constructor.name).toBe("Object");
    });
  });

  describe("testEnvironment property", () => {
    test("testEnvironment is set to 'node'", () => {
      expect(config.testEnvironment).toBe("node");
    });

    test("testEnvironment is a string", () => {
      expect(typeof config.testEnvironment).toBe("string");
    });

    test("testEnvironment uses Node.js environment (not jsdom or browser)", () => {
      // Verify the deliberate choice for Node.js environment
      expect(config.testEnvironment).not.toBe("jsdom");
      expect(config.testEnvironment).not.toBe("browser");
    });
  });

  describe("testPathIgnorePatterns property", () => {
    test("testPathIgnorePatterns is an array", () => {
      expect(Array.isArray(config.testPathIgnorePatterns)).toBe(true);
    });

    test("testPathIgnorePatterns contains /node_modules/ pattern", () => {
      expect(config.testPathIgnorePatterns).toContain("/node_modules/");
    });

    test("testPathIgnorePatterns contains /dist/ pattern", () => {
      expect(config.testPathIgnorePatterns).toContain("/dist/");
    });

    test("testPathIgnorePatterns has exactly two exclusion patterns", () => {
      expect(config.testPathIgnorePatterns).toHaveLength(2);
    });

    test("patterns use correct regex format with forward slashes", () => {
      config.testPathIgnorePatterns.forEach((pattern) => {
        expect(pattern).toMatch(/^\/.*\/$/);
      });
    });
  });

  describe("configuration compatibility", () => {
    test("configuration only contains recognized Jest properties", () => {
      const allowedProperties = ["testEnvironment", "testPathIgnorePatterns"];
      const configKeys = Object.keys(config);

      configKeys.forEach((key) => {
        expect(allowedProperties).toContain(key);
      });
    });

    test("configuration does not override test discovery mechanisms", () => {
      // Verify minimal configuration approach
      expect(config.testMatch).toBeUndefined();
      expect(config.testRegex).toBeUndefined();
      expect(config.testPathIgnorePatterns).toBeDefined();
    });

    test("configuration preserves default test file discovery", () => {
      // With testPathIgnorePatterns set, Jest uses defaults for testMatch
      expect(config.testMatch).toBeUndefined();
      // This allows Jest to use its default: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"]
    });
  });

  describe("minimalism and readability", () => {
    test("configuration contains only essential properties", () => {
      const keyCount = Object.keys(config).length;
      expect(keyCount).toBeLessThanOrEqual(2);
    });

    test("configuration maintains straightforward style", () => {
      // Verify no complex transformations or nested objects
      expect(config.testEnvironment).toEqual("node");
      expect(config.testPathIgnorePatterns).toEqual([
        "/node_modules/",
        "/dist/",
      ]);
    });
  });

  describe("interface contract preservation", () => {
    test("testEnvironment enables Node.js globals for tests", () => {
      expect(config.testEnvironment).toBe("node");
      // This ensures src/clock-source.test.js can run with Node.js globals
    });

    test("testPathIgnorePatterns prevents scanning installed packages", () => {
      expect(config.testPathIgnorePatterns).toContain("/node_modules/");
    });

    test("testPathIgnorePatterns excludes compiled artifacts", () => {
      expect(config.testPathIgnorePatterns).toContain("/dist/");
      // Ensures built output doesn't interfere with test discovery
    });
  });

  describe("schema compliance", () => {
    test("testEnvironment value conforms to Jest schema", () => {
      const validEnvironments = ["node", "jsdom", "browser"];
      expect(validEnvironments).toContain(config.testEnvironment);
    });

    test("testPathIgnorePatterns values are valid regex patterns", () => {
      config.testPathIgnorePatterns.forEach((pattern) => {
        // Should not throw when compiled as regex
        expect(() => new RegExp(pattern)).not.toThrow();
      });
    });
  });
});

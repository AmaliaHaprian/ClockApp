const babelConfig = require("./babel.config");

describe("babel.config", () => {
  test("exports a config object with a presets array", () => {
    expect(babelConfig).toBeTruthy();
    expect(typeof babelConfig).toBe("object");
    expect(Array.isArray(babelConfig.presets)).toBe(true);
  });

  test("includes @babel/preset-env and @babel/preset-react (classic runtime) in order", () => {
    const presets = babelConfig.presets;

    expect(presets[0]).toEqual([
      "@babel/preset-env",
      expect.objectContaining({ targets: { node: expect.any(String) } }),
    ]);

    expect(presets[1]).toEqual([
      "@babel/preset-react",
      expect.objectContaining({ runtime: "classic" }),
    ]);
  });
});

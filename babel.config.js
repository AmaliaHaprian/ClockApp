// jest's transform for the JSX/ESM sources (Jest runs on Node, which needs
// both translated to plain CommonJS before it can require() them).
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "classic" }],
  ],
};

// chore(babel): keep classic React JSX transform and target current Node.js
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "classic" }],
  ],
};

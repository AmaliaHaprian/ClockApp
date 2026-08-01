// Jest's transform for the JSX/ESM sources. Jest runs on Node.js, which
// requires both JSX and ES modules to be translated to CommonJS before
// execution. This configuration uses:
//   - @babel/preset-env: Transpiles modern JavaScript to the current Node.js version
//   - @babel/preset-react: Transforms JSX syntax using the classic React runtime
//     (required for React 16 compatibility without React in scope)
module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "classic" }],
  ],
};

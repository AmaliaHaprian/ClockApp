/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};

module.exports = config;

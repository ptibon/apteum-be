module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "src",
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};

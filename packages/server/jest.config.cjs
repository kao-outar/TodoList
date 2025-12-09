module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  // Specify coverage reporters required for the coverage job
  coverageReporters: [
    "json",
    "lcov",
    "text",
    "clover"
  ],
};

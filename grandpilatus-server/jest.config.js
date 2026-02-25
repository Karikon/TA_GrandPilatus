const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  reporters: [
    "default",
    [
      "jest-html-reporter",
      {
        pageTitle: "Grand Pilatus API Test Report",
        outputPath: "reports/jest-report.html",
        includeConsoleLog: true,
        includeFailureMsg: true,
      },
    ],
  ],
};

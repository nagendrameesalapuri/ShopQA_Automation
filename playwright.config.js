const { defineConfig, devices } = require("@playwright/test");
require("dotenv").config();

module.exports = defineConfig({
  testDir: "./tests",

  // Multi-reporter setup for comprehensive reporting
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["json", { outputFile: "test-results/results.json" }],
    ["junit", { outputFile: "test-results/junit.xml" }],
    ["list"],
  ],

  // Global timeout settings
  timeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 30 * 1000,

  expect: {
    timeout: process.env.EXPECT_TIMEOUT ? parseInt(process.env.EXPECT_TIMEOUT) : 5000,
  },

  // Parallelization configuration
  fullyParallel: true,
  workers: process.env.CI ? 1 : undefined,

  // Retry strategy for CI environments
  retries: process.env.CI ? 2 : 0,

  use: {
    baseURL: process.env.BASE_URL || "https://nagendra-shopqa.netlify.app/",

    headless: process.env.HEADLESS ? process.env.HEADLESS === "false" : true,

    screenshot: "only-on-failure",

    trace: "on-first-retry",

    video: "retain-on-failure",

    actionTimeout: 10000,
  },

  // Multiple browser projects for cross-browser testing
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    // {
    //   name: "firefox",
    //   use: {
    //     ...devices["Desktop Firefox"],
    //   },
    // },
    // {
    //   name: "webkit",
    //   use: {
    //     ...devices["Desktop Safari"],
    //   },
    // },
  ],

  // No local web server is required for this project because the app is already hosted.
  webServer: undefined,
});

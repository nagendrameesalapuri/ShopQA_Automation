const { test } = require("@playwright/test");
const { POManager } = require("../../pageObjects/POManager");
const logger = require("../../utils/logger");

test.describe("Accessibility", () => {
  let accessibilityPage;

  test.beforeEach(async ({ page }) => {
    const poManager = new POManager(page);
    accessibilityPage = poManager.getAccessibilityPage();
  });

  test("@regression should have proper ARIA labels on navigation", async () => {
    const testName = "should have proper ARIA labels on navigation";
    logger.testStart(testName);
    await accessibilityPage.navigateHome();
    await accessibilityPage.verifyNavigationAccessibility();
    logger.testPass(testName);
  });

  test("@regression should be keyboard navigable", async () => {
    const testName = "should be keyboard navigable";
    logger.testStart(testName);
    await accessibilityPage.navigateToLogin();
    await accessibilityPage.verifyKeyboardNavigation();
    logger.testPass(testName);
  });

  test("@sanity should have correct page title", async () => {
    const testName = "should have correct page title";
    logger.testStart(testName);
    await accessibilityPage.navigateHome();
    await accessibilityPage.verifyPageTitle();
    logger.testPass(testName);
  });
});

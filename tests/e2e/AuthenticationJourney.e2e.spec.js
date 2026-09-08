const { test } = require("@playwright/test");
const { POManager } = require("../../pageObjects/POManager");
const logger = require("../../utils/logger");

test.describe("@e2e E2E: Authentication and authorization", () => {
  test("customer can authenticate and access order history", async ({ page }) => {
    const testName = "customer can authenticate and access order history";
    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
    const ordersPage = poManager.getOrdersPage();

    logger.testStart(testName);
    await loginPage.navigate();
    await loginPage.loginAs("customer");
    await ordersPage.navigateToOrdersPage();
    await ordersPage.verifyOrdersPageVisible();
    logger.testPass(testName);
  });

  test("admin can authenticate and access the admin dashboard", async ({ page }) => {
    const testName = "admin can authenticate and access the admin dashboard";
    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
    const adminPage = poManager.getAdminPage();

    logger.testStart(testName);
    await loginPage.navigate();
    await loginPage.loginAs("admin");
    await adminPage.navigateToAdminDashboard();
    await adminPage.verifyDashboardStatsVisible();
    logger.testPass(testName);
  });
});

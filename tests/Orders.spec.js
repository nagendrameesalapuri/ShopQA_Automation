const { test } = require("@playwright/test");
const { POManager } = require("../pageObjects/POManager");
const logger = require("../utils/logger");

test.describe("Orders", () => {
  let loginPage;
  let ordersPage;

  test.beforeEach(async ({ page }) => {
    const poManager = new POManager(page);
    loginPage = poManager.getLoginPage();
    ordersPage = poManager.getOrdersPage();
    await loginPage.navigate();
    await loginPage.loginAs("customer");
  });

  test("should display order history", async () => {
    const testName = "should display order history";
    logger.testStart(testName);
    await ordersPage.navigateToOrdersPage();
    await ordersPage.verifyOrdersPageVisible();
    logger.testPass(testName);
  });

  test("should filter orders by status", async () => {
    const testName = "should filter orders by status";
    const status = "delivered";
    logger.testStart(testName);
    await ordersPage.navigateToOrdersPage();
    await ordersPage.filterOrdersByStatus(status);
    await ordersPage.verifyAllOrdersHaveStatus(status);
    logger.testPass(testName);
  });
});

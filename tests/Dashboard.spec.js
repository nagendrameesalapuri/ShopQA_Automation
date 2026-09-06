const { test, expect } = require("@playwright/test");
const { POManager } = require("../pageObjects/POManager");
const logger = require("../utils/logger");

test.describe("Checkout", () => {
  let loginPage;
  let dashboardPage;

  test.beforeEach(async ({ page }) => {
    const poManager = new POManager(page);
    loginPage = poManager.getLoginPage();
    dashboardPage = poManager.getDashboardPage();
    await loginPage.navigate();
    await loginPage.loginAs("customer");
  });

  test("should search product", async ({ page }) => {
    const productName = "iPhone";
    logger.info(`Starting product search for: ${productName}`);
    await dashboardPage.searchProduct(productName);
    await expect(page).toHaveURL(new RegExp(`search=${productName}`), { timeout: 10000 });
    logger.info(`Search URL verified: search=${productName}`);
    await dashboardPage.verifySearchResult(productName);
    logger.info(`Search results verified for: ${productName}`);
  });
});

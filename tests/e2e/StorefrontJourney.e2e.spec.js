const { test } = require("@playwright/test");
const { POManager } = require("../../pageObjects/POManager");
const logger = require("../../utils/logger");

test.describe("E2E: Storefront journey", () => {
  test("customer can search the catalog and view product details", async ({ page }) => {
    const testName = "customer can search the catalog and view product details";
    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
    const productsPage = poManager.getProductsPage();

    logger.testStart(testName);
    await loginPage.navigate();
    await loginPage.loginAs("customer");
    await productsPage.navigateToProductsPage();
    await productsPage.verifyProductsPageLoaded();
    await productsPage.searchProduct("iPhone");
    await productsPage.verifySearchResults("iPhone");
    await productsPage.verifyProductDetails();
    logger.testPass(testName);
  });

  test("customer can view order history after signing in", async ({ page }) => {
    const testName = "customer can view order history after signing in";
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
});

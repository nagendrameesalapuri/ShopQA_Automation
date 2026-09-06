const { test, expect } = require("@playwright/test");
const { POManager } = require("../pageObjects/POManager");
const logger = require("../utils/logger");

test.describe("Checkout", () => {
  let productsPage;
  let cartPage;
  let loginPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    const poManager = new POManager(page);
    cartPage = poManager.getCartPage();
    productsPage = poManager.getProductsPage();
    loginPage = poManager.getLoginPage();
    checkoutPage = poManager.getCartPage();
    await loginPage.navigate();
    await loginPage.loginAs("customer");
    await productsPage.navigateToProductsPage();
  });

  test("should show step indicator with 4 steps", async ({ page }) => {});
});

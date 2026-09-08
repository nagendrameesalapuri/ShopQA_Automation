const { test } = require("@playwright/test");
const { POManager } = require("../../pageObjects/POManager");
const { CheckoutData } = require("../../testData/CheckoutData");
const logger = require("../../utils/logger");

test.describe("@regression Regression: Checkout delivery options", () => {
  for (const deliveryType of CheckoutData.deliveryOptions) {
    test(`should continue checkout with ${deliveryType} delivery`, async ({ page }) => {
      const testName = `should continue checkout with ${deliveryType} delivery`;
      const poManager = new POManager(page);
      const loginPage = poManager.getLoginPage();
      const dashboardPage = poManager.getDashboardPage();
      const cartPage = poManager.getCartPage();
      const checkoutPage = poManager.getCheckoutPage();

      logger.testStart(testName);
      await loginPage.navigate();
      await loginPage.loginAs("customer");
      await dashboardPage.searchProduct("iPhone");
      await cartPage.addFirstProductToCart();
      await cartPage.clickProceedToCheckout();

      await checkoutPage.enterShippingDetails(CheckoutData.valid);
      await checkoutPage.clickNext();
      await checkoutPage.verifyCheckoutStep(checkoutPage.deliveryStep);
      await checkoutPage.selectDelivery(deliveryType);
      await checkoutPage.clickNext();
      await checkoutPage.verifyCheckoutStep(checkoutPage.paymentStep);
      logger.testPass(testName);
    });
  }
});

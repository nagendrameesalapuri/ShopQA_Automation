const { test } = require("@playwright/test");
const { POManager } = require("../../pageObjects/POManager");
const { CheckoutData } = require("../../testData/CheckoutData");
const logger = require("../../utils/logger");

test.describe("@e2e E2E: Customer checkout journey", () => {
  test("customer can move from product search to order review", async ({ page }) => {
    const testName = "customer can move from product search to order review";
    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
    const dashboardPage = poManager.getDashboardPage();
    const cartPage = poManager.getCartPage();
    const checkoutPage = poManager.getCheckoutPage();

    logger.testStart(testName);
    await loginPage.navigate();
    await loginPage.loginAs("customer");
    await dashboardPage.searchProduct("iPhone");
    await dashboardPage.verifySearchResult("iPhone");
    await cartPage.addFirstProductToCart();
    await cartPage.clickProceedToCheckout();

    await checkoutPage.enterShippingDetails(CheckoutData.valid);
    await checkoutPage.clickNext();
    await checkoutPage.verifyCheckoutStep(checkoutPage.deliveryStep);
    await checkoutPage.selectDelivery("express");
    await checkoutPage.openDatePicker();
    await checkoutPage.selectDeliveryDate(CheckoutData.testDate);
    await checkoutPage.clickNext();
    await checkoutPage.verifyCheckoutStep(checkoutPage.paymentStep);
    await checkoutPage.selectCreditCardPayment();
    await checkoutPage.enterPaymentDetails(CheckoutData.valid);
    await checkoutPage.clickNext();
    await checkoutPage.verifyCheckoutStep(checkoutPage.reviewStep);
    await checkoutPage.expectVisible(checkoutPage.placeOrderButton);
    logger.testPass(testName);
  });
});

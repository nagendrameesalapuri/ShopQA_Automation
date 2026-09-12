const { test } = require("@playwright/test");
const { POManager } = require("../../pageObjects/POManager");
const { CheckoutData } = require("../../testData/CheckoutData");
const logger = require("../../utils/logger");

test.describe("Interactive Elements", () => {
  let loginPage;
  let adminPage;

  test.beforeEach(async ({ page }) => {
    const poManager = new POManager(page);
    loginPage = poManager.getLoginPage();
    adminPage = poManager.getAdminPage();
    await loginPage.navigate();
    await loginPage.loginAs("admin");
    await adminPage.navigateToProductsPage();
    await adminPage.openAddProductModal();
  });

  test("@regression should perform file upload via drag-and-drop", async () => {
    const testName = "should perform file upload via drag-and-drop";
    logger.testStart(testName);
    await adminPage.verifyDropzoneDragOver();
    logger.testPass(testName);
  });

  test("@regression should open and close modal popup", async () => {
    const testName = "should open and close modal popup";
    logger.testStart(testName);
    await adminPage.closeProductModal();
    logger.testPass(testName);
  });
});

test.describe("Checkout Date Picker", () => {
  let loginPage;
  let dashboardPage;
  let cartPage;
  let checkoutPage;

  test.beforeEach(async ({ page }) => {
    const poManager = new POManager(page);
    loginPage = poManager.getLoginPage();
    dashboardPage = poManager.getDashboardPage();
    cartPage = poManager.getCartPage();
    checkoutPage = poManager.getCheckoutPage();
    await loginPage.navigate();
    await loginPage.loginAs("customer");
    await cartPage.clearCart();
    await dashboardPage.searchProduct("iPhone");
    await cartPage.addFirstProductToCart();
    await cartPage.clickProceedToCheckout();
    await checkoutPage.enterShippingDetails(CheckoutData.valid);
    await checkoutPage.clickNext();
  });

  test("@regression should open date picker and select a date", async () => {
    const testName = "should open date picker and select a date";
    logger.testStart(testName);
    await checkoutPage.openDatePicker();
    await checkoutPage.selectDeliveryDate(CheckoutData.testDate);
    await checkoutPage.verifyDatePickerClosed();
    logger.testPass(testName);
  });
});

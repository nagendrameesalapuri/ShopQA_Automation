const { test } = require("@playwright/test");
const { POManager } = require("../../pageObjects/POManager");
const { CheckoutData } = require("../../testData/CheckoutData");
const logger = require("../../utils/logger");

test.describe("Checkout", () => {
  let loginPage;
  let dashboardPage;
  let cartPage;
  let checkoutPage;

  async function openCheckoutForProduct(productName = "iPhone") {
    await test.step(`Open checkout flow for product: ${productName}`, async () => {
      logger.info(`Starting product search for: ${productName}`);
      await cartPage.clearCart();
      await dashboardPage.searchProduct(productName);
      await cartPage.addFirstProductToCart();
      await cartPage.clickProceedToCheckout();
    });
  }

  test.beforeEach(async ({ page }) => {
    const poManager = new POManager(page);
    loginPage = poManager.getLoginPage();
    dashboardPage = poManager.getDashboardPage();
    cartPage = poManager.getCartPage();
    checkoutPage = poManager.getCheckoutPage();
    await loginPage.navigate();
    await loginPage.loginAs("customer");
  });

  test("@sanity should show step indicator with 4 steps", async () => {
    logger.testStart("should show step indicator with 4 steps");
    await openCheckoutForProduct();
    await checkoutPage.verifyStepIndicatorCount(4);
    logger.testPass("should show step indicator with 4 steps");
  });

  test("@regression should validate required shipping fields", async () => {
    logger.testStart("should validate required shipping fields");
    await openCheckoutForProduct();
    await checkoutPage.clickNext();
    await checkoutPage.verifyRequiredFieldsValidation();
    logger.testPass("should validate required shipping fields");
  });

  test("@regression should validate postal code format", async () => {
    logger.testStart("should validate postal code format");
    await openCheckoutForProduct();
    await checkoutPage.enterShippingDetails({
      fullName: CheckoutData.invalid.fullName,
      phone: CheckoutData.invalid.phone,
      line1: CheckoutData.invalid.address,
      city: CheckoutData.invalid.city,
      state: CheckoutData.invalid.state,
      postal: CheckoutData.invalid.postalCode,
    });
    await checkoutPage.clickNext();
    await checkoutPage.verifyPostalCodeValidation();
    logger.testPass("should validate postal code format");
  });

  test("@sanity should navigate through all checkout steps", async () => {
    logger.testStart("should navigate through all checkout steps");
    const deliveryType = "express";
    await openCheckoutForProduct();

    await checkoutPage.enterShippingDetails(CheckoutData.valid);
    await checkoutPage.clickNext();
    await checkoutPage.verifyCheckoutStep(checkoutPage.deliveryStep);

    await checkoutPage.selectDelivery(deliveryType);
    await checkoutPage.openDatePicker();
    await checkoutPage.selectDeliveryDate(CheckoutData.testDate);
    await checkoutPage.clickNext();
    await checkoutPage.verifyCheckoutStep(checkoutPage.paymentStep);

    await checkoutPage.selectCreditCardPayment();
    await checkoutPage.enterPaymentDetails(CheckoutData.valid);
    await checkoutPage.clickNext();
    await checkoutPage.verifyCheckoutStep(checkoutPage.reviewStep);
    await checkoutPage.expectVisible(checkoutPage.placeOrderButton);
    logger.testPass("should navigate through all checkout steps");
  });

  test("@regression should simulate payment failure with declined card", async () => {
    const testName = "should simulate payment failure with declined card";
    logger.testStart(testName);
    await openCheckoutForProduct();

    await checkoutPage.enterShippingDetails({
      ...CheckoutData.valid,
      line1: "123 Main St",
      city: "Mumbai",
      state: "Maharashtra",
      postal: "400001",
    });
    await checkoutPage.clickNext();
    await checkoutPage.clickNext();
    await checkoutPage.selectCreditCardPayment();
    await checkoutPage.enterPaymentDetails({
      ...CheckoutData.valid,
      cardNumber: "4000000000000002",
    });
    await checkoutPage.clickNext();
    await checkoutPage.placeOrder();
    await checkoutPage.verifyPaymentFailure();
    logger.testPass(testName);
  });

  test("@regression should select date from date picker", async () => {
    const testName = "should select date from date picker";
    logger.testStart(testName);
    await openCheckoutForProduct();

    await checkoutPage.enterShippingDetails({
      ...CheckoutData.valid,
      city: "Delhi",
      state: "Delhi",
      postal: "110001",
    });
    await checkoutPage.clickNext();
    await checkoutPage.openDatePicker();
    await checkoutPage.expectVisible(checkoutPage.datePickerCalendar);
    await checkoutPage.selectDeliveryDate(CheckoutData.testDate);
    await checkoutPage.verifyDatePickerClosed();
    logger.testPass(testName);
  });
});

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
      await cartPage.clearCart();
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

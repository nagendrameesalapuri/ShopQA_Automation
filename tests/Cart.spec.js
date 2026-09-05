const { test, expect } = require("@playwright/test");
const { POManager } = require("../pageObjects/POManager");
const logger = require("../utils/logger");
const { CartData } = require("../testData/CartData");

test.describe("Shopping Cart", () => {
  let productsPage;
  let cartPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    const poManager = new POManager(page);
    cartPage = poManager.getCartPage();
    productsPage = poManager.getProductsPage();
    loginPage = poManager.getLoginPage();
    await loginPage.navigate();
    await loginPage.loginAs("customer");
    await productsPage.navigateToProductsPage();
  });

  test("@smoke should add product to cart", async () => {
    logger.testStart("should add product to cart");
    const initialCount = await cartPage.getCartCount();
    await cartPage.addFirstProductToCart();
    await cartPage.verifyCartCount(initialCount + 1);
    logger.testPass("Test completed successfully: should add product to cart");
  });

  test("@smoke should show toast on add to cart", async () => {
    logger.testStart("should show toast on add to cart");
    await cartPage.addFirstProductToCart();
    await cartPage.verifyToastMessageForAddToCart();
    logger.testPass("should show toast on add to cart");
  });

  test("@smoke should update quantity in cart", async () => {
    logger.testStart("should update quantity in cart");
    await cartPage.addFirstProductToCart();
    await cartPage.navigateToCartPage();
    let qtyBefore = await cartPage.getCartQuantity();
    await cartPage.increaseQuantity();
    await cartPage.verifyCartQuantity(qtyBefore + 1);
    qtyBefore = await cartPage.getCartQuantity();
    await cartPage.decreaseQuantity();
    await cartPage.verifyCartQuantity(qtyBefore - 1);
    logger.testPass("should update quantity in cart");
  });

  test("@smoke should remove item from cart", async () => {
    logger.testStart("should remove item from cart");
    await cartPage.addFirstProductToCart();
    await cartPage.navigateToCartPage();
    const countBefore = await cartPage.getRemoveItemCount();
    if (countBefore > 0) {
      expect(countBefore).toBeGreaterThan(0);
      await cartPage.removeFirstItem();
      await cartPage.verifyItemCount(countBefore - 1);
    }
    logger.testPass("should remove item from cart");
  });

  test("@smoke should reject invalid coupon", async () => {
    logger.testStart("should reject invalid coupon");
    await cartPage.addFirstProductToCart();
    await cartPage.navigateToCartPage();
    await cartPage.applyCoupon(CartData.invalid.coupon);
    await cartPage.verifyCouponError();
    logger.testPass("should reject invalid coupon");
  });

  test("should reject expired coupon", async ({ page }) => {
    logger.testStart("should reject invalid coupon");
    await cartPage.addFirstProductToCart();
    await cartPage.navigateToCartPage();
    await cartPage.applyCoupon(CartData.expired.coupon);
    await cartPage.verifyExpiredCouponError();
    logger.testPass("should reject invalid coupon");
  });

  test("@smoke should apply valid coupon", async () => {
    logger.testStart("should apply valid coupon");
    await cartPage.addFirstProductToCart();
    await cartPage.navigateToCartPage();
    await cartPage.applyCoupon(CartData.valid.coupon);
    await cartPage.verifyCouponApplied();
    logger.testPass("should apply valid coupon");
  });
  test("@smoke should show correct total with coupon", async ({ page }) => {
    logger.testStart("verify correct total with coupon");
    await cartPage.addFirstProductToCart();
    await cartPage.navigateToCartPage();
    const subtotal = await cartPage.getCartSubtotal();
    logger.info(`Subtotal before coupon: ₹${subtotal}`);

    await cartPage.applyCoupon(CartData.valid.coupon);
    await cartPage.verifyCouponApplied();
    const discount = await cartPage.getDiscountAmount();
    const total = await cartPage.getCartTotal();
    logger.info(`Discount applied: ₹${discount}`);
    logger.info(`Final total: ₹${total}`);

    // 18% GST is calculated after discount
    const taxableAmount = subtotal - discount;
    const expectedTax = taxableAmount * 0.18;
    const expectedTotal = taxableAmount + expectedTax;
    expect(total).toBeCloseTo(expectedTotal, 2);
    logger.info(`Expected total: ₹${expectedTotal}`);
    logger.testPass("Coupon total calculation verified successfully");
  });
});

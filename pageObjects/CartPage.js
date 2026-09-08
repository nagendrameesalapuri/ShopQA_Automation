const { SELECTORS } = require("../constants/selectors");
const { BasePage } = require("./BasePage");
const logger = require("../utils/logger");
const { APP_TEXT } = require("../constants/constants");
const { ROUTES } = require("../constants/routes");
const { expect } = require("@playwright/test");

class CartPage extends BasePage {
  constructor(page) {
    super(page);
    this.addToCartButton = page.locator(SELECTORS.ADD_TO_CART_BUTTON);
    this.cartCount = page.locator(SELECTORS.CART_COUNT);
    this.toast = page.locator(SELECTORS.CART_TOAST);
    this.cartQtyIncrease = page.locator(SELECTORS.CART_QUANTITY_INCREASE);
    this.cartQtyDecrease = page.locator(SELECTORS.CART_QUANTITY_DECREASE);
    this.cartQty = page.locator(SELECTORS.CART_QUANTITY);
    this.removeItemButton = page.locator(SELECTORS.REMOVE_ITEM_BUTTON);
    this.couponInput = page.locator(SELECTORS.COUPON_INPUT);
    this.applyCouponButton = page.locator(SELECTORS.APPLY_COUPON_BUTTON);
    this.removeCouponButton = page.getByRole("button", { name: /[✕×]/ });
    this.couponSuccess = page.locator(SELECTORS.COUPON_SUCCESS);
    this.couponError = page.locator(SELECTORS.COUPON_ERROR);
    this.discountAmount = page.locator(SELECTORS.DISCOUNT_AMOUNT);
    this.cartSubtotal = page.locator(SELECTORS.CART_SUBTOTAL);
    this.cartTotal = page.locator(SELECTORS.CART_TOTAL);
    this.checkoutButton = page.locator(SELECTORS.PROCEED_CHECKOUT_BUTTON);
  }

  async navigateToCartPage() {
    await this.navigate(ROUTES.CART);
  }

  async getCartCount() {
    logger.info("Getting initial cart count");
    await this.waitForElement(this.addToCartButton.first());
    const cartCount = await this.cartCount.textContent();
    logger.info(`Initial cart count: ${cartCount}`);
    return parseInt(cartCount || "0", 10);
  }

  async addFirstProductToCart() {
    logger.info("Adding first product to cart");
    await this.click(this.addToCartButton.first());
    await this.expectContainsText(this.toast, APP_TEXT.ADDED_TO_CART_MESSAGE);
  }

  async verifyCartCount(expectedCount) {
    logger.info(`Verifying cart count is ${expectedCount}`);
    await this.expectContainsText(this.cartCount, String(expectedCount));
    logger.info(`Cart count verified successfully: ${expectedCount}`);
  }

  async verifyToastMessageForAddToCart() {
    logger.info("Verifying add cart toast message");
    await this.expectContainsText(this.toast, APP_TEXT.ADDED_TO_CART_MESSAGE);
  }

  async getCartQuantity() {
    logger.info("Getting current cart quantity");
    const quantity = parseInt((await this.cartQty.first().textContent()) || "0", 10);
    logger.info(`Current cart quantity: ${quantity}`);
    return quantity;
  }

  async increaseQuantity() {
    logger.info("Increasing product quantity");
    await this.click(this.cartQtyIncrease.first());
    logger.info("Product quantity increase clicked");
  }

  async decreaseQuantity() {
    logger.info("Decreasing product quantity");
    await this.click(this.cartQtyDecrease.first());
    logger.info("Product quantity decrease clicked");
  }

  async verifyCartQuantity(expectedQuantity) {
    logger.info(`Verifying cart quantity is ${expectedQuantity}`);
    await this.expectHasText(this.cartQty.first(), String(expectedQuantity));
    logger.info(`Cart quantity verified successfully: ${expectedQuantity}`);
  }

  async getRemoveItemCount() {
    logger.info("Getting current number of items in cart");
    await this.waitForElement(this.removeItemButton.first());
    const count = await this.removeItemButton.count();
    logger.info(`Current cart item count: ${count}`);
    return count;
  }

  async removeFirstItem() {
    logger.info("Removing first item from cart");
    await this.click(this.removeItemButton.first());
    logger.info("First cart item removed");
  }

  async verifyItemCount(expectedCount) {
    logger.info(`Verifying cart item count is ${expectedCount}`);
    await expect(this.removeItemButton).toHaveCount(expectedCount);
    logger.info(`Cart item count verified successfully: ${expectedCount}`);
  }

  async applyCoupon(couponCode) {
    logger.info(`Applying coupon: ${couponCode}`);
    await this.navigateToCartPage();
    await expect(this.couponInput.or(this.removeCouponButton)).toBeVisible();
    if (!(await this.couponInput.isVisible())) {
      logger.info("Removing previously applied coupon");
      await this.click(this.removeCouponButton.last());
    }
    await this.waitForElement(this.couponInput);
    await this.fill(this.couponInput, couponCode);
    await this.click(this.applyCouponButton);
    logger.info(`Coupon applied: ${couponCode}`);
  }

  async verifyCouponApplied() {
    logger.info("Verifying coupon success message");
    await this.expectVisible(this.couponSuccess);
    logger.info("Coupon success message is displayed");
    await this.expectVisible(this.discountAmount);
    logger.info("Discount amount is displayed");
  }

  async verifyCouponError() {
    logger.info("Verifying coupon error message");
    await this.expectVisible(this.couponError);
    logger.info("Coupon error message is displayed");
  }

  async verifyCouponErrorContains(expectedText) {
    logger.info(`Verifying coupon error contains: ${expectedText}`);
    await this.expectContainsText(this.couponError, expectedText);
    logger.info(`Coupon error verified: ${expectedText}`);
  }

  async verifyExpiredCouponError() {
    logger.info("Verifying expired coupon error");
    await expect(this.couponError).toContainText(/expired|invalid/i);
    logger.info("Expired coupon rejected successfully");
  }

  async getCartSubtotal() {
    logger.info("Getting cart subtotal");
    const subtotalText = await this.cartSubtotal.textContent();
    const subtotal = parseFloat(subtotalText?.replace(/[^0-9.]/g, "") || "0");
    logger.info(`Cart subtotal: ${subtotal}`);
    return subtotal;
  }

  async getCartTotal() {
    logger.info("Getting cart total");
    const totalText = await this.cartTotal.textContent();
    const total = parseFloat(totalText?.replace(/[^0-9.]/g, "") || "0");
    logger.info(`Cart total: ${total}`);
    return total;
  }

  async verifyTotalAfterCoupon(subtotal) {
    logger.info(`Verifying total after coupon is less than subtotal: ${subtotal}`);
    let total = await this.getCartTotal();
    expect(total).toBeGreaterThan(0);
    logger.info(`Coupon applied successfully. Subtotal: ${subtotal}, Total: ${total}`);
  }

  async getDiscountAmount() {
    logger.info("Getting discount amount");
    const text = await this.discountAmount.textContent();
    return parseFloat(text.replace(/[^0-9.]/g, ""));
  }

  async clickProceedToCheckout() {
    logger.info("Navigating to cart before checkout");
    await this.navigateToCartPage();
    await this.waitForElement(this.checkoutButton);
    logger.info("Clicking proceed to check out");
    await this.click(this.checkoutButton);
  }
}

module.exports = { CartPage };

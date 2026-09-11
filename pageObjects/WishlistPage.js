const { expect } = require("@playwright/test");
const { BasePage } = require("./BasePage");
const { SELECTORS } = require("../constants/selectors");
const { ROUTES } = require("../constants/routes");
const { APP_TEXT } = require("../constants/constants");
const { TIMEOUTS } = require("../constants/timeouts");
const logger = require("../utils/logger");

class WishlistPage extends BasePage {
  constructor(page) {
    super(page);
    this.wishlistNavLink = page.locator(SELECTORS.NAV_WISHLIST);
    this.menuWishlistLink = page.locator(SELECTORS.MENU_WISHLIST);
    this.wishlistToggleButton = page.locator(SELECTORS.WISHLIST_TOGGLE_BUTTON);
    this.toast = page.locator(SELECTORS.TOAST).last();
    this.wishlistPageContainer = page.locator(SELECTORS.WISHLIST_PAGE);
    this.wishlistHeading = page.locator(SELECTORS.WISHLIST_HEADING);
    this.emptyWishlist = page.locator(SELECTORS.EMPTY_WISHLIST);
    this.wishlistItems = page.locator(SELECTORS.WISHLIST_ITEM);
    this.wishlistItemNames = page.locator(SELECTORS.WISHLIST_ITEM_NAME);
    this.removeWishlistItemButton = page.locator(SELECTORS.REMOVE_WISHLIST_ITEM);
    this.wishlistAddToCartButton = page.locator(SELECTORS.WISHLIST_ADD_TO_CART);
    this.cartCount = page.locator(SELECTORS.CART_COUNT);
  }

  async navigateToWishlistPage() {
    logger.info(`Navigating to wishlist page: ${ROUTES.WISHLIST}`);
    await this.navigate(ROUTES.WISHLIST);
    await this.page.waitForLoadState(APP_TEXT.NETWORKIDLE);
    await this.waitForElement(this.wishlistHeading);
  }

  async goToWishlistRoute() {
    logger.info(`Navigating directly to wishlist route: ${ROUTES.WISHLIST}`);
    await this.navigate(ROUTES.WISHLIST);
  }

  async reloadWishlistPage() {
    logger.info("Reloading wishlist page");
    await this.reload();
    await this.page.waitForLoadState(APP_TEXT.NETWORKIDLE);
    await this.waitForElement(this.wishlistHeading);
  }

  async clickWishlistNavLink() {
    logger.info("Clicking wishlist nav link");
    await this.click(this.wishlistNavLink);
  }

  async addCurrentProductToWishlist() {
    logger.info("Adding current product to wishlist");
    await this.waitForElement(this.wishlistToggleButton);
    await this.click(this.wishlistToggleButton);
    await this.expectHasAttribute(this.wishlistToggleButton, "aria-pressed", "true");
    await this.page.waitForTimeout(TIMEOUTS.ANIMATION);
  }

  async removeCurrentProductFromWishlist() {
    logger.info("Removing current product from wishlist via detail page toggle");
    await this.click(this.wishlistToggleButton);
    await this.expectHasAttribute(this.wishlistToggleButton, "aria-pressed", "false");
    await this.page.waitForTimeout(TIMEOUTS.ANIMATION);
  }

  async verifyToastMessage(expectedText) {
    logger.info(`Verifying toast message contains: ${expectedText}`);
    await this.expectContainsText(this.toast, expectedText);
  }

  async verifyWishlistPageLoaded() {
    logger.info("Verifying wishlist page is loaded");
    await this.expectVisible(this.wishlistHeading);
  }

  async getWishlistItemCount() {
    return await this.wishlistItems.count();
  }

  async verifyWishlistCount(expectedCount) {
    logger.info(`Verifying wishlist count is ${expectedCount}`);
    await this.expectContainsText(this.wishlistHeading, `(${expectedCount})`);
    await expect(this.wishlistItems).toHaveCount(expectedCount);
  }

  async verifyEmptyWishlist() {
    logger.info("Verifying empty wishlist state");
    await this.expectVisible(this.emptyWishlist);
    await this.expectContainsText(this.emptyWishlist, APP_TEXT.EMPTY_WISHLIST_MESSAGE);
  }

  async verifyProductInWishlist(productName) {
    logger.info(`Verifying product in wishlist: ${productName}`);
    await this.expectContainsText(this.wishlistItemNames.first(), productName);
  }

  async removeFirstWishlistItem() {
    logger.info("Removing first item from wishlist page");
    await this.click(this.removeWishlistItemButton.first());
    await this.page.waitForTimeout(TIMEOUTS.ANIMATION);
  }

  async clearWishlist() {
    logger.info("Clearing all items from wishlist");
    let count = await this.getWishlistItemCount();
    while (count > 0) {
      await this.click(this.removeWishlistItemButton.first());
      await this.page.waitForTimeout(TIMEOUTS.ANIMATION);
      count = await this.getWishlistItemCount();
    }
  }

  async moveFirstItemToCart() {
    logger.info("Adding first wishlist item to cart");
    await this.click(this.wishlistAddToCartButton.first());
    await this.page.waitForTimeout(TIMEOUTS.ANIMATION);
  }

  async getCartCount() {
    const text = await this.cartCount.textContent().catch(() => "0");
    return parseInt(text || "0", 10);
  }

  async verifyCartCount(expectedCount) {
    logger.info(`Verifying cart count is ${expectedCount}`);
    await this.expectContainsText(this.cartCount, String(expectedCount));
  }
}

module.exports = { WishlistPage };

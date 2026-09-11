const { test, expect } = require("@playwright/test");
const { POManager } = require("../../pageObjects/POManager");
const logger = require("../../utils/logger");
const { APP_TEXT } = require("../../constants/constants");

test.describe("Wishlist", () => {
  let productsPage;
  let wishlistPage;
  let loginPage;

  test.beforeEach(async ({ page }) => {
    const poManager = new POManager(page);
    productsPage = poManager.getProductsPage();
    wishlistPage = poManager.getWishlistPage();
    loginPage = poManager.getLoginPage();
    await loginPage.navigate();
    await loginPage.loginAs("customer");
    await productsPage.navigateToProductsPage();
    await productsPage.openFirstProduct();
  });

  test("@smoke should add product to wishlist from product detail page", async () => {
    logger.testStart("should add product to wishlist from product detail page");
    await wishlistPage.addCurrentProductToWishlist();
    await wishlistPage.verifyToastMessage(APP_TEXT.ADDED_TO_WISHLIST_MESSAGE);
    logger.testPass("should add product to wishlist from product detail page");
  });

  test("@smoke should display added product on wishlist page", async () => {
    logger.testStart("should display added product on wishlist page");
    const productName = (await productsPage.productDetailName.textContent()).trim();
    await wishlistPage.addCurrentProductToWishlist();
    await wishlistPage.navigateToWishlistPage();
    await wishlistPage.verifyWishlistPageLoaded();
    await wishlistPage.verifyProductInWishlist(productName);
    logger.testPass("should display added product on wishlist page");
  });

  test("@regression should remove product from wishlist using detail page toggle", async () => {
    logger.testStart("should remove product from wishlist using detail page toggle");
    await wishlistPage.addCurrentProductToWishlist();
    await wishlistPage.removeCurrentProductFromWishlist();
    await wishlistPage.verifyToastMessage(APP_TEXT.REMOVED_FROM_WISHLIST_MESSAGE);
    logger.testPass("should remove product from wishlist using detail page toggle");
  });

  test("@regression should remove item from wishlist page", async () => {
    logger.testStart("should remove item from wishlist page");
    await wishlistPage.addCurrentProductToWishlist();
    await wishlistPage.navigateToWishlistPage();
    const countBefore = await wishlistPage.getWishlistItemCount();
    expect(countBefore).toBeGreaterThan(0);
    await wishlistPage.removeFirstWishlistItem();
    await wishlistPage.verifyToastMessage(APP_TEXT.REMOVED_FROM_WISHLIST_MESSAGE);
    await wishlistPage.verifyWishlistCount(countBefore - 1);
    logger.testPass("should remove item from wishlist page");
  });

  test("@regression should add wishlist item to cart without removing it from wishlist", async () => {
    logger.testStart("should add wishlist item to cart without removing it from wishlist");
    await wishlistPage.addCurrentProductToWishlist();
    await wishlistPage.navigateToWishlistPage();
    const cartCountBefore = await wishlistPage.getCartCount();
    const itemCountBefore = await wishlistPage.getWishlistItemCount();
    await wishlistPage.moveFirstItemToCart();
    await wishlistPage.verifyToastMessage(APP_TEXT.ADDED_TO_CART_MESSAGE);
    await wishlistPage.verifyCartCount(cartCountBefore + 1);
    expect(await wishlistPage.getWishlistItemCount()).toBe(itemCountBefore);
    logger.testPass("should add wishlist item to cart without removing it from wishlist");
  });

  test("@regression should persist wishlist items after page reload", async () => {
    logger.testStart("should persist wishlist items after page reload");
    await wishlistPage.addCurrentProductToWishlist();
    await wishlistPage.navigateToWishlistPage();
    const countBefore = await wishlistPage.getWishlistItemCount();
    await wishlistPage.reloadWishlistPage();
    expect(await wishlistPage.getWishlistItemCount()).toBe(countBefore);
    logger.testPass("should persist wishlist items after page reload");
  });

  test("@regression should show empty wishlist state when no items are saved", async () => {
    logger.testStart("should show empty wishlist state when no items are saved");
    await wishlistPage.navigateToWishlistPage();
    await wishlistPage.clearWishlist();
    await wishlistPage.verifyEmptyWishlist();
    logger.testPass("should show empty wishlist state when no items are saved");
  });

  test("@regression should navigate to wishlist page via navbar wishlist icon", async () => {
    logger.testStart("should navigate to wishlist page via navbar wishlist icon");
    await wishlistPage.clickWishlistNavLink();
    await wishlistPage.verifyWishlistPageLoaded();
    logger.testPass("should navigate to wishlist page via navbar wishlist icon");
  });
});

test.describe("Wishlist - Unauthenticated Access", () => {
  test("@regression should redirect to login when accessing wishlist without authentication", async ({
    page,
  }) => {
    logger.testStart("should redirect to login when accessing wishlist without authentication");
    const poManager = new POManager(page);
    const wishlistPage = poManager.getWishlistPage();
    await wishlistPage.goToWishlistRoute();
    await expect(page).toHaveURL(/\/login/);
    logger.testPass("should redirect to login when accessing wishlist without authentication");
  });
});

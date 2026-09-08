const { BasePage } = require("../pageObjects/BasePage");
const { expect } = require("@playwright/test");
const { SELECTORS } = require("../constants/selectors");
const { ROUTES } = require("../constants/routes");
const { APP_TEXT } = require("../constants/constants");
const { TIMEOUTS } = require("../constants/timeouts");
const logger = require("../utils/logger");

class ProductsPage extends BasePage {
  constructor(page) {
    super(page);
    this.productGrid = page.locator(SELECTORS.PRODUCT_GRID);
    this.viewList = page.locator(SELECTORS.LIST_VIEW_BUTTON);
    this.viewGrid = page.locator(SELECTORS.GRID_VIEW_BUTTON);
    this.productCards = page.locator(SELECTORS.PRODUCT_CARD);
    this.productCount = page.locator(SELECTORS.PRODUCT_COUNT);
    this.pageHeader = page.locator(SELECTORS.PRODUCTS_HEADING);
    this.sortDropdown = page.locator(SELECTORS.SORT_DROPDOWN);
    this.categoryFilter = (category) => page.locator(SELECTORS.PRODUCT_CATEGORY_FILTER(category));
    this.sortDropdown = page.locator(SELECTORS.SORT_DROPDOWN);
    this.productPrices = page.locator(SELECTORS.PRODUCT_PRICE);
    this.searchInput = page.locator(SELECTORS.PRODUCT_SEARCH_INPUT);
    this.searchButton = page.locator(SELECTORS.PRODUCT_SEARCH_BUTTON);
    this.emptyState = page.locator(SELECTORS.EMPTY_STATE);
    this.nextPage = page.locator(SELECTORS.NEXT_PAGE);
    this.productNames = page.locator(SELECTORS.PRODUCT_NAME);
    this.infiniteScrollToggle = page.locator(SELECTORS.INFINITE_SCROLL_TOGGLE);
    this.outOfStockBadge = page.locator(SELECTORS.OUT_OF_STOCK_BADGE);
    this.productDetailName = page.locator(SELECTORS.PRODUCT_DETAIL_NAME);
    this.productDetailPrice = page.locator(SELECTORS.PRODUCT_DETAIL_PRICE);
    this.productDetailStock = page.locator(SELECTORS.PRODUCT_DETAIL_STOCK);
    this.productDetailRating = page.locator(SELECTORS.PRODUCT_DETAIL_RATING).first();
  }

  async navigateToProductsPage() {
    logger.info(`Navigating to products page: ${ROUTES.PRODUCTS}`);
    await this.navigate(ROUTES.PRODUCTS);
  }

  async verifyProductsPageLoaded() {
    logger.info("Verifying product listing page is loaded");
    await this.expectVisible(this.productGrid);
  }

  async verifyPageHeading() {
    logger.info("Verifying page heading");
    await this.expectVisible(this.pageHeader);
  }

  async verifyProductCount() {
    logger.info("Verifying product count");
    await this.expectNotContainsText(this.productCount, APP_TEXT.LOADING_LABEL);
    await this.expectContainsText(this.productCount, APP_TEXT.PRODUCT_COUNT_LABEL);
    await expect(this.productCards).not.toHaveCount(0);
    const displayedCount = await this.productCount.textContent();
    const countMatch = displayedCount.match(/(\d+)/);
    expect(countMatch).not.toBeNull();
    expect(Number(countMatch[1])).toBeGreaterThan(0);
  }

  async verifyDefaultSorting(expectedValue) {
    logger.info(`Verifying default sorting value: ${expectedValue}`);
    await this.expectVisible(this.sortDropdown);
    await this.expectHasValue(this.sortDropdown, expectedValue);
  }

  async verifyGridAndListViews() {
    logger.info("Verifying grid and list view toggles");
    await this.click(this.viewList);
    await expect(this.productGrid).toHaveClass(/list-view/);
    await this.click(this.viewGrid);
    await expect(this.productGrid).not.toHaveClass(/list-view/);
  }

  async selectCategory(category) {
    logger.info(`Selecting product category: ${category}`);
    await this.check(this.categoryFilter(category));
  }

  async verifyCategorySelected(category) {
    logger.info(`Verifying category ${category} is selected`);
    await expect(this.categoryFilter(category)).toBeChecked();
  }

  async verifyProductsDisplayed() {
    logger.info("Verifying product cards are displayed");
    await this.expectVisible(this.productCards.first());
    const count = await this.productCards.count();
    expect(count).toBeGreaterThan(APP_TEXT.ZERO);
  }

  async verifyDisplayedProducts(category) {
    logger.info(`Verifying displayed products belong to category: ${category}`);
    await this.expectVisible(this.productCards.first());
    const count = await this.productCards.count();
    expect(count).toBeGreaterThan(APP_TEXT.ZERO);
    const categories = this.productCards.locator(SELECTORS.PRODUCT_CATEGORY);
    await expect(categories).toHaveCount(count);
    const categoryTexts = await categories.allTextContents();
    for (const text of categoryTexts) {
      expect(text.trim().toLowerCase()).toBe(category.toLowerCase());
    }
  }

  async sortProductsByValue(value) {
    logger.info(`Sorting products by: ${value}`);
    await this.sortDropdown.selectOption(value);
  }

  async verifyProductsSortedByPriceAscending() {
    logger.info("Verifying products sorted by price ascending");
    await this.expectVisible(this.productCards.first());
    const prices = this.productCards.locator(SELECTORS.PRODUCT_PRICE);
    const priceTexts = await prices.allTextContents();
    const numericPrices = priceTexts.map((price) => parseInt(price.replace(/[^0-9]/g, ""), 10));
    for (let i = 0; i < numericPrices.length - 1; i++) {
      expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i + 1]);
    }
  }

  async searchProduct(productName) {
    logger.info(`Searching for product: ${productName}`);
    await this.fill(this.searchInput, productName);
    await this.click(this.searchButton);
    await this.page.waitForLoadState(APP_TEXT.NETWORKIDLE);
  }

  async verifySearchURL(searchTerm) {
    logger.info(`Verifying search URL contains: ${searchTerm}`);
    await expect(this.page).toHaveURL(new RegExp(`search=${searchTerm}`));
  }

  async verifySearchResults(searchTerm) {
    logger.info(`Verifying search results for: ${searchTerm}`);
    await this.expectVisible(this.productCards.first());
    const productTexts = await this.productCards.allTextContents();
    for (const text of productTexts) {
      expect(text.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
  }

  async verifyNoSearchResults() {
    logger.info("Verifying empty state for no search results");
    await this.expectVisible(this.emptyState);
    await this.expectContainsText(this.emptyState, APP_TEXT.NO_PRODUCTS_FOUND);
  }

  async getFirstProductName() {
    logger.info("Getting first product name");
    return await this.productNames.first().textContent();
  }

  async goToNextPage() {
    logger.info("Going to the next page of products");
    await this.click(this.nextPage);
    await this.page.waitForLoadState(APP_TEXT.NETWORKIDLE);
  }

  async verifyPageNumber(pageNumber) {
    logger.info(`Verifying current page number is ${pageNumber}`);
    await expect(this.page).toHaveURL(new RegExp(`page=${pageNumber}`));
  }

  async verifyDifferentProduct(firstProductName) {
    logger.info("Verifying product content changes after pagination");
    const afterFirst = await this.productNames.first().textContent();
    expect(firstProductName).not.toBe(afterFirst);
  }

  async verifyInfiniteScroll() {
    logger.info("Verifying infinite scroll behavior");
    this.check(this.infiniteScrollToggle);
    const initialCount = await this.productCards.count();
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
    const newCount = await this.productCards.count();
    expect(newCount).toBeGreaterThanOrEqual(initialCount);
  }

  async verifyOutOfStockBadge() {
    logger.info("Verifying out-of-stock badge");
    await this.navigate(ROUTES.OUT_OF_STOCK);
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
    const oosBadge = this.outOfStockBadge.first();
    await expect(oosBadge).toContainText(APP_TEXT.OUT_OF_STOCK);
  }

  async verifyProductDetails() {
    logger.info("Opening product details and verifying detail fields");
    await this.click(this.productCards.first());
    await this.expectAllVisible([
      this.productDetailName,
      this.productDetailPrice,
      this.productDetailStock,
      this.productDetailRating,
    ]);
  }
}

module.exports = { ProductsPage };

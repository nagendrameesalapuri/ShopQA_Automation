const { BasePage } = require("../pageObjects/BasePage");
const { expect } = require("@playwright/test");
const { SELECTORS } = require("../constants/selectors");
const { ROUTES } = require("../constants/routes");
const { APP_TEXT } = require("../constants/constants");
const { TIMEOUTS } = require("../constants/timeouts");

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
    this.productDetailRating = page.locator(SELECTORS.PRODUCT_DETAIL_RATING);
  }

  async navigateToProductsPage() {
    await this.navigate(ROUTES.PRODUCTS);
  }

  async verifyProductsPageLoaded() {
    await this.expectVisible(this.productGrid);
  }

  async verifyPageHeading() {
    await this.expectVisible(this.pageHeader);
  }

  async verifyProductCount() {
    await this.expectNotContainsText(this.productCount, APP_TEXT.LOADING_LABEL);
    await this.expectContainsText(this.productCount, APP_TEXT.PRODUCT_COUNT_LABEL);
    await expect(this.productCards).not.toHaveCount(0);
    const displayedCount = await this.productCount.textContent();
    const countMatch = displayedCount.match(/(\d+)/);
    expect(countMatch).not.toBeNull();
    expect(Number(countMatch[1])).toBeGreaterThan(0);
  }

  async verifyDefaultSorting(expectedValue) {
    await this.expectVisible(this.sortDropdown);
    await this.expectHasValue(this.sortDropdown, expectedValue);
  }

  async verifyGridAndListViews() {
    await this.click(this.viewList);
    await expect(this.productGrid).toHaveClass(/list-view/);
    await this.click(this.viewGrid);
    await expect(this.productGrid).not.toHaveClass(/list-view/);
  }

  async selectCategory(category) {
    await this.check(this.categoryFilter(category));
  }

  async verifyCategorySelected(category) {
    await expect(this.categoryFilter(category)).toBeChecked();
  }

  async verifyProductsDisplayed() {
    await this.expectVisible(this.productCards.first());
    const count = await this.productCards.count();
    expect(count).toBeGreaterThan(APP_TEXT.ZERO);
  }

  async verifyDisplayedProducts(category) {
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
    await this.sortDropdown.selectOption(value);
  }

  async verifyProductsSortedByPriceAscending() {
    await this.expectVisible(this.productCards.first());
    const prices = this.productCards.locator(SELECTORS.PRODUCT_PRICE);
    const priceTexts = await prices.allTextContents();
    const numericPrices = priceTexts.map((price) => parseInt(price.replace(/[^0-9]/g, ""), 10));
    for (let i = 0; i < numericPrices.length - 1; i++) {
      expect(numericPrices[i]).toBeLessThanOrEqual(numericPrices[i + 1]);
    }
  }

  async searchProduct(productName) {
    await this.fill(this.searchInput, productName);
    await this.click(this.searchButton);
    await this.page.waitForLoadState(APP_TEXT.NETWORKIDLE);
  }

  async verifySearchURL(searchTerm) {
    await expect(this.page).toHaveURL(new RegExp(`search=${searchTerm}`));
  }

  async verifySearchResults(searchTerm) {
    await this.expectVisible(this.productCards.first());
    const productTexts = await this.productCards.allTextContents();
    for (const text of productTexts) {
      expect(text.toLowerCase()).toContain(searchTerm.toLowerCase());
    }
  }

  async verifyNoSearchResults() {
    await this.expectVisible(this.emptyState);
    await this.expectContainsText(this.emptyState, APP_TEXT.NO_PRODUCTS_FOUND);
  }

  async getFirstProductName() {
    return await this.productNames.first().textContent();
  }

  async goToNextPage() {
    await this.click(this.nextPage);
    await this.page.waitForLoadState(APP_TEXT.NETWORKIDLE);
  }

  async verifyPageNumber(pageNumber) {
    await expect(this.page).toHaveURL(new RegExp(`page=${pageNumber}`));
  }

  async verifyDifferentProduct(firstProductName) {
    const afterFirst = await this.productNames.first().textContent();
    expect(firstProductName).not.toBe(afterFirst);
  }

  async verifyInfiniteScroll() {
    this.check(this.infiniteScrollToggle);
    const initialCount = await this.productCards.count();
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
    const newCount = await this.productCards.count();
    expect(newCount).toBeGreaterThanOrEqual(initialCount);
  }

  async verifyOutOfStockBadge() {
    await this.navigate(ROUTES.OUT_OF_STOCK);
    await this.page.waitForTimeout(TIMEOUTS.SHORT);
    const oosBadge = this.outOfStockBadge.first();
    await expect(oosBadge).toContainText(APP_TEXT.OUT_OF_STOCK);
  }

  async verifyProductDetails() {
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

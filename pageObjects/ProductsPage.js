const { BasePage } = require("../pageObjects/BasePage");
const { expect } = require("@playwright/test");
const { SELECTORS } = require("../constants/selectors");
const { ROUTES } = require("../constants/routes");
const { APP_TEXT } = require("../constants/constants");

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
}

module.exports = { ProductsPage };

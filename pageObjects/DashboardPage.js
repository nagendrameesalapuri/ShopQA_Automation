const { SELECTORS } = require("../constants/selectors");
const { BasePage } = require("./BasePage");
const { expect } = require("@playwright/test");
const logger = require("../utils/logger");

class DashboardPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchInput = page.locator(SELECTORS.SEARCH_INPUT);
    this.searchButton = page.locator(SELECTORS.SEARCH_BUTTON);
  }

  async searchProduct(productName) {
    logger.info(`Searching for product: ${productName}`);
    await this.fill(this.searchInput, productName);
    await this.click(this.searchButton);
    logger.info(`Search submitted for product: ${productName}`);
  }

  async verifySearchResult(productName) {
    logger.info(`Verifying search results for: ${productName}`);
    await this.expectVisible(this.page.locator(SELECTORS.PRODUCT_CARD).first());
    const products = this.page.locator(SELECTORS.PRODUCT_CARD);
    const productTexts = await products.allTextContents();
    for (const text of productTexts) {
      expect(text.toLowerCase()).toContain(productName.toLowerCase());
    }
    logger.info(`Search results verified for: ${productName}`);
  }
}

module.exports = { DashboardPage };

const { expect } = require("@playwright/test");
const { SELECTORS } = require("../constants/selectors");
const { ROUTES } = require("../constants/routes");
const { BasePage } = require("./BasePage");
const logger = require("../utils/logger");

class AccessibilityPage extends BasePage {
  constructor(page) {
    super(page);
    this.searchRegion = page.locator(SELECTORS.HOME_SEARCH_REGION);
    this.searchInput = page.locator(SELECTORS.SEARCH_ACCESSIBLE_INPUT);
    this.loginEmailInput = page.locator(SELECTORS.EMAIL_INPUT);
  }

  async navigateHome() {
    logger.info("Navigating to storefront home page");
    await this.navigate(ROUTES.HOME);
  }

  async navigateToLogin() {
    logger.info("Navigating to login page for keyboard navigation");
    await this.navigate(ROUTES.LOGIN);
  }

  async verifyNavigationAccessibility() {
    logger.info("Verifying navigation accessibility labels");
    await this.expectVisible(this.searchRegion);
    await this.expectVisible(this.searchInput);
  }

  async verifyKeyboardNavigation() {
    logger.info("Verifying keyboard navigation reaches a tagged control");
    await this.loginEmailInput.focus();
    await this.page.keyboard.press("Tab");
    const focusedTestId = await this.page.evaluate(() =>
      document.activeElement?.getAttribute("data-testid"),
    );
    expect(focusedTestId).toBeTruthy();
  }

  async verifyPageTitle() {
    logger.info("Verifying storefront page title");
    await expect(this.page).toHaveTitle(/ShopQA/i);
  }
}

module.exports = { AccessibilityPage };

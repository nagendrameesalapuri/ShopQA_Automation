const { SELECTORS } = require("../constants/selectors");
const { BasePage } = require("../pageObjects/BasePage");

class CheckoutPage extends BasePage {
  constructor(page) {
    super(page);
    this.nextStep = page.locator(SELECTORS.CHECK_OUT_NEXT_STEP);
    this.stepIndicator = page.locator(SELECTORS.CHECK_OUT_STEP);
    this.fullName = page.locator(SELECTORS.CHECK_OUT_FULL_NAME);
    this.phone = page.locator(SELECTORS.CHECK_OUT_PHONE);
    this.addressLine1 = page.locator(SELECTORS.CHECK_OUT_ADDRESS_LINE1);
    this.city = page.locator(SELECTORS.CHECK_OUT_CITY);
    this.state = page.locator(SELECTORS.CHECK_OUT_STATE);
    this.postalCode = page.locator(SELECTORS.CHECK_OUT_POSTAL_CODE);
    this.toastNotification = page.locator(SELECTORS.TOAST);
  }

  async verifyStepIndicatorCount(expectedCount) {
    logger.info(`Verifying checkout has ${expectedCount} steps`);
    await expect(this.stepIndicator).toHaveCount(expectedCount);
  }

  async clickNext() {
    logger.info("Clicking Next button");
    await this.click(this.nextStep);
  }

  async verifyRequiredFieldsValidation() {
    logger.info("Verifying required shipping fields validation");
    await expect(this.toastNotification).toContainText(/required|fill/i);
  }

  async enterShippingDetails({ fullName, phone, line1, city, state, postal }) {
    logger.info("Entering shipping details");
    await this.fill(this.fullName, fullName);
    await this.fill(this.phone, phone);
    await this.fill(this.addressLine1, line1);
    await this.fill(this.city, city);
    await this.fill(this.state, state);
    await this.fill(this.postalCode, postal);
  }
}
module.exports = { CheckoutPage };

const { SELECTORS } = require("../constants/selectors");
const { BasePage } = require("../pageObjects/BasePage");
const { expect } = require("@playwright/test");
const logger = require("../utils/logger");

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
    this.deliveryStep = page.locator(SELECTORS.CHECK_OUT_DELIVERY_STEP);
    this.paymentStep = page.locator(SELECTORS.CHECK_OUT_PAYMENT_STEP);
    this.creditCardPayment = page.locator(SELECTORS.CHECK_OUT_PAYMENT_CREDIT_CARD);
    this.cardNumber = page.locator(SELECTORS.CHECK_OUT_CARD_NUMBER);
    this.cardExpiry = page.locator(SELECTORS.CHECK_OUT_CARD_EXPIRY);
    this.cardCvv = page.locator(SELECTORS.CHECK_OUT_CARD_CVV);
    this.cardName = page.locator(SELECTORS.CHECK_OUT_CARD_NAME);
    this.reviewStep = page.locator(SELECTORS.CHECK_OUT_REVIEW_STEP);
    this.placeOrderButton = page.locator(SELECTORS.CHECK_OUT_PLACE_ORDER);
    this.datePickerTrigger = page.locator(SELECTORS.CHECK_OUT_DATE_PICKER_TRIGGER);
    this.datePickerCalendar = page.locator(SELECTORS.CHECK_OUT_DATE_PICKER_CALENDAR);
    this.nextMonthButton = page.locator(SELECTORS.CHECK_OUT_DATE_PICKER_NEXT_MONTH);
    this.datePickerDays = page.locator(SELECTORS.CHECK_OUT_DATE_PICKER_DAY);
    this.toastNotification = page.locator(SELECTORS.TOAST).filter({ hasText: /required|fill/i });
    this.paymentErrorToast = page.locator(SELECTORS.TOAST).filter({ hasText: /payment/i });
  }

  async verifyStepIndicatorCount(expectedCount) {
    logger.info(`Verifying checkout has ${expectedCount} steps`);
    await expect(this.stepIndicator).toHaveCount(expectedCount);
  }

  async clickNext() {
    logger.info("Clicking Next button");
    await this.click(this.nextStep);
  }

  async selectDelivery(deliveryType) {
    const normalizedDeliveryType = String(deliveryType).trim().toLowerCase();
    const supportedDeliveryTypes = ["standard", "express", "overnight", "pickup"];

    if (!supportedDeliveryTypes.includes(normalizedDeliveryType)) {
      throw new Error(
        `Unsupported delivery type: ${deliveryType}. Supported values: ${supportedDeliveryTypes.join(", ")}`,
      );
    }

    logger.info(`Selecting ${normalizedDeliveryType} delivery`);
    await this.click(
      this.page.locator(SELECTORS.CHECK_OUT_DELIVERY_OPTION(normalizedDeliveryType)),
    );
  }

  async selectCreditCardPayment() {
    logger.info("Selecting credit card payment");
    await this.click(this.creditCardPayment);
  }

  async enterPaymentDetails({ cardNumber, cardExpiry, cardCvv, cardName }) {
    logger.info("Entering payment details");
    await this.fill(this.cardNumber, cardNumber);
    await this.fill(this.cardExpiry, cardExpiry);
    await this.fill(this.cardCvv, cardCvv);
    await this.fill(this.cardName, cardName);
  }

  async verifyCheckoutStep(stepLocator) {
    await this.expectVisible(stepLocator);
  }

  async placeOrder() {
    logger.info("Placing order");
    await this.click(this.placeOrderButton);
  }

  async verifyPaymentFailure() {
    logger.info("Verifying payment failure");
    await this.expectContainsText(this.paymentErrorToast, /payment/i);
  }

  async openDatePicker() {
    logger.info("Opening delivery date picker");
    await this.click(this.datePickerTrigger);
  }

  async selectDeliveryDate({ monthOffset = 0, day }) {
    if (!Number.isInteger(monthOffset) || monthOffset < 0) {
      throw new Error(`monthOffset must be a non-negative integer: ${monthOffset}`);
    }

    if (!Number.isInteger(day) || day < 1 || day > 31) {
      throw new Error(`day must be an integer between 1 and 31: ${day}`);
    }

    logger.info(`Selecting delivery date with month offset ${monthOffset}, day ${day}`);
    for (let month = 0; month < monthOffset; month += 1) {
      await this.click(this.nextMonthButton);
    }

    const dateButton = this.datePickerDays.filter({ hasText: new RegExp(`^${day}$`) });
    await expect(dateButton).toHaveCount(1);
    await dateButton.click();
  }

  async verifyDatePickerClosed() {
    await expect(this.datePickerCalendar).not.toBeVisible();
  }

  async verifyRequiredFieldsValidation() {
    logger.info("Verifying required shipping fields validation");
    await this.expectContainsText(this.toastNotification, /required|fill/i);
  }

  async verifyPostalCodeValidation() {
    logger.info("Verifying postal code validation");
    await this.expectURLContains(/checkout/i);
    await this.expectVisible(this.postalCode);
  }

  async enterShippingDetails({ fullName, phone, line1, city, state, postal }) {
    logger.info("Entering shipping details");
    await this.fill(this.fullName, fullName);
    await this.fill(this.phone, phone);
    await this.fill(this.addressLine1, line1);
    await this.fill(this.city, city);
    await this.selectDropdown(this.state, { label: state });
    await this.fill(this.postalCode, postal);
  }
}
module.exports = { CheckoutPage };

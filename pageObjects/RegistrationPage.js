const { BasePage } = require("./BasePage");
const { CustomAssertions } = require("../utils/assertions");
const { SELECTORS } = require("../constants/selectors");
const { ROUTES } = require("../constants/routes");
const { APP_TEXT } = require("../constants/constants");
const logger = require("../utils/logger");

class RegistrationPage extends BasePage {
  constructor(page) {
    super(page);
    this.requiredError = page.locator(SELECTORS.REQUIRED_ERROR);
    this.registrationForm = page.locator(SELECTORS.REGISTRATION_FORM);
    this.firstNameInput = page.locator(SELECTORS.REGISTRATION_FIRST_NAME_INPUT);
    this.lastNameInput = page.locator(SELECTORS.REGISTRATION_LAST_NAME_INPUT);
    this.emailInput = page.locator(SELECTORS.REGISTRATION_EMAIL_INPUT);
    this.passwordInput = page.locator(SELECTORS.REGISTRATION_PASSWORD_INPUT);
    this.confirmPasswordInput = page.locator(SELECTORS.REGISTRATION_CONFIRM_PASSWORD_INPUT);
    this.phoneInput = page.locator(SELECTORS.REGISTRATION_PHONE_INPUT);
    this.createAccountButton = page.locator(SELECTORS.CREATE_ACCOUNT_BUTTON);
    this.signInLink = page.locator(SELECTORS.SIGN_IN_LINK);
    this.passwordStrength = page.locator(SELECTORS.PASSWORD_STRENGTH);
    this.confirmPasswordError = page.locator(SELECTORS.CONFIRM_PASSWORD_ERROR);
    this.registrationSuccessMsg = page.locator(SELECTORS.REGISTRATION_SUCCESS_MESSAGE);
  }

  async navigateToRegistrationPage() {
    logger.info(`Navigating to registration page: ${ROUTES.REGISTRATION}`);
    await this.page.goto(ROUTES.REGISTRATION);
  }

  async verifyRegistrationFormVisible() {
    logger.info("Verifying registration form fields are visible");
    await this.expectAllVisible([
      this.registrationForm,
      this.firstNameInput,
      this.lastNameInput,
      this.emailInput,
      this.passwordInput,
      this.confirmPasswordInput,
      this.phoneInput,
      this.createAccountButton,
      this.signInLink,
    ]);
  }

  async clickCreateAccount() {
    logger.info("Clicking Create Account button");
    await this.click(this.createAccountButton);
  }

  async verifyEmptyFormValidation() {
    logger.info("Verifying empty form validation errors");
    await CustomAssertions.expectElementCount(this.requiredError, 4);
    await this.expectAllVisible(await this.requiredError.all());
  }

  async signupWith(firstName, lastName, email, password, confirmPassword, phone) {
    logger.info(`Signing up new user: ${email}`);
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.fill(this.confirmPasswordInput, confirmPassword);
    await this.fill(this.phoneInput, phone);
    await this.click(this.createAccountButton);
  }

  async verifyInvalidEmailError() {
    logger.info("Verifying invalid email error during registration");
    await this.expectContainsText(this.requiredError, APP_TEXT.INVALID_EMAIL_MESSAGE);
  }

  async verifyWeakPassword() {
    logger.info("Verifying weak password validation message");
    await this.expectContainsText(this.passwordStrength, APP_TEXT.WEAK_PASSWORD_MESSAGE);
  }

  async verifyPasswordMismatchError() {
    logger.info("Verifying password mismatch error");
    await this.expectVisible(this.confirmPasswordError);
  }

  async verifyRegistrationSuccess() {
    logger.info("Verifying successful registration message");
    await this.expectVisible(this.registrationSuccessMsg);
  }
}

module.exports = { RegistrationPage };

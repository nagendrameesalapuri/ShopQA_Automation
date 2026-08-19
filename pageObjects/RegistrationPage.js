const { BasePage } = require("./BasePage");
const { CustomAssertions } = require("../utils/assertions");
const { SELECTORS } = require("../constants/selectors");
const { ROUTES } = require("../constants/routes");

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
    await this.page.goto(ROUTES.REGISTRATION);
  }

  async verifyRegistrationFormVisible() {
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
    await this.click(this.createAccountButton);
  }

  async verifyEmptyFormValidation() {
    await CustomAssertions.expectElementCount(this.requiredError, 4);
    await this.expectAllVisible(await this.requiredError.all());
  }

  async signupWith(firstName, lastName, email, password, confirmPassword, phone) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.emailInput, email);
    await this.fill(this.passwordInput, password);
    await this.fill(this.confirmPasswordInput, confirmPassword);
    await this.fill(this.phoneInput, phone);
    await this.click(this.createAccountButton);
  }

  async verifyInvalidEmailError() {
    await this.expectContainsText(this.requiredError, "Invalid email");
  }

  async verifyWeakPassword() {
    await this.expectContainsText(this.passwordStrength, "Very Weak");
  }

  async verifyPasswordMismatchError() {
    await this.expectVisible(this.confirmPasswordError);
  }

  async verifyRegistrationSuccess() {
    await this.expectVisible(this.registrationSuccessMsg);
  }
}

module.exports = { RegistrationPage };

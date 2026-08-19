const { BasePage } = require("./BasePage");
const { TIMEOUTS } = require("../constants/timeouts");
const { SELECTORS } = require("../constants/selectors");
const { ROUTES } = require("../constants/routes");
const logger = require("../utils/logger");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.locator(SELECTORS.EMAIL_INPUT);
    this.loginForm = page.locator(SELECTORS.LOGIN_FORM);
    this.passwordInput = page.locator(SELECTORS.PASSWORD_INPUT);
    this.signInButton = page.locator(SELECTORS.SIGN_IN_BUTTON);
    this.rememberMeCheckbox = page.locator(SELECTORS.REMEMBER_ME_CHECKBOX);
    this.togglePassword = page.locator(SELECTORS.TOGGLE_PASSWORD);
    this.emailError = page.locator(SELECTORS.EMAIL_ERROR);
    this.passwordError = page.locator(SELECTORS.PASSWORD_ERROR);
    this.loginError = page.locator(SELECTORS.LOGIN_ERROR);
    this.userMenu = page.locator(SELECTORS.USER_MENU);
    this.adminMenu = page.locator(SELECTORS.ADMIN_DASHBOARD);
    this.sessionExpiredMsg = page.locator(SELECTORS.SESSION_EXPIRED_MSG);
    this.forgotPasswordLink = page.locator(SELECTORS.FORGOT_PASSWORD_LINK);
  }

  async navigate() {
    logger.info("Navigating to login page");
    await this.page.goto(ROUTES.LOGIN);
  }

  async navigateToExpiredSession() {
    logger.info("Navigating to login page with expired session");
    await this.page.goto(ROUTES.EXPIRED_SESSION);
  }

  async verifyLoginFormVisible() {
    logger.info("Verifying login form is visible");
    await this.expectAllVisible([
      this.loginForm,
      this.emailInput,
      this.passwordInput,
      this.signInButton,
      this.rememberMeCheckbox,
      this.togglePassword,
      this.forgotPasswordLink,
    ]);
  }

  async clickLogin() {
    logger.info("Clicking Sign In button");
    await this.click(this.signInButton);
  }

  async verifyEmptyFormValidation() {
    logger.info("Verifying empty form validation errors");
    await this.expectVisible(this.emailError);
    await this.expectVisible(this.passwordError);
  }

  async enterEmail(email) {
    logger.info(`Entering email: ${email}`);
    await this.fill(this.emailInput, email);
  }

  async enterPassword(password) {
    logger.info("Entering password");
    await this.fill(this.passwordInput, password);
  }

  async verifyInvalidEmailError() {
    logger.info("Verifying invalid email error message");
    await this.expectContainsText(this.emailError, "valid email");
  }

  async verifyLoginError() {
    logger.info("Verifying login error message");
    await this.expectVisible(this.loginError);
    await this.expectContainsText(this.loginError, "Invalid");
  }

  async loginAs(email, password) {
    logger.info(`Attempting to login as: ${email}`);
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLogin();
  }

  async verifyCustomerLoggedIn() {
    logger.info("Verifying customer is logged in");
    await this.waitForElement(this.userMenu, TIMEOUTS.LONG);
  }

  async verifyAdminLoggedIn() {
    logger.info("Verifying admin is logged in");
    await this.waitForElement(this.adminMenu, TIMEOUTS.EXTRA_LONG);
  }

  async verifyTogglePasswordVisibility() {
    logger.info("Verifying password toggle visibility");
    await this.fill(this.passwordInput, "Password@123");
    await this.expectHasAttribute(this.passwordInput, "type", "password");

    logger.info("Clicking password toggle to show password");
    await this.click(this.togglePassword);
    await this.expectHasAttribute(this.passwordInput, "type", "text");

    logger.info("Clicking password toggle to hide password");
    await this.click(this.togglePassword);
    await this.expectHasAttribute(this.passwordInput, "type", "password");
  }

  async verifySessionExpiredMessage() {
    logger.info("Verifying session expired message");
    await this.expectVisible(this.sessionExpiredMsg);
  }
}

module.exports = { LoginPage };

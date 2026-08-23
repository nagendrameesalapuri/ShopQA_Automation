const { BasePage } = require("./BasePage");
const { TIMEOUTS } = require("../constants/timeouts");
const { SELECTORS } = require("../constants/selectors");
const { ROUTES } = require("../constants/routes");
const { APP_TEXT, TEST_VALUES } = require("../constants/constants");
const { loginData } = require("../testData/loginData");
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
    this.successToast = page.getByRole(SELECTORS.ALERT);
  }

  async navigate() {
    logger.info(`Navigating to ${APP_TEXT.LOGIN_PAGE}`);
    await this.page.goto(ROUTES.LOGIN);
  }

  async navigateToExpiredSession() {
    logger.info(`Navigating to ${APP_TEXT.EXPIRED_SESSION_LOGIN_PAGE}`);
    await this.page.goto(ROUTES.EXPIRED_SESSION);
  }

  async verifyLoginFormVisible() {
    logger.info(`Verifying ${APP_TEXT.LOGIN_FORM} is visible`);
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
    logger.info(`Clicking ${APP_TEXT.SIGN_IN_BUTTON}`);
    await this.click(this.signInButton);
  }

  async verifyEmptyFormValidation() {
    logger.info(`Verifying ${APP_TEXT.EMPTY_FORM_VALIDATION}`);
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
    await this.expectContainsText(this.emailError, APP_TEXT.INVALID_EMAIL_ERROR);
  }

  async verifyLoginError() {
    logger.info("Verifying login error message");
    await this.expectVisible(this.loginError);
    await this.expectContainsText(this.loginError, APP_TEXT.INVALID_LOGIN_ERROR);
  }

  async loginAs(role = "customer") {
    const credentials = loginData[role];
    if (!credentials) {
      throw new Error(`Invalid login role: ${role}`);
    }
    logger.info(`Attempting to login as: ${role}`);
    await this.enterEmail(credentials.email);
    await this.enterPassword(credentials.password);
    await this.clickLogin();
    await this.expectContainsText(this.successToast, APP_TEXT.WELCOME_MESSAGE);
    logger.info(`Successfully logged in as: ${role}`);
  }

  async verifyCustomerLoggedIn() {
    logger.info(`Verifying ${APP_TEXT.CUSTOMER_LOGGED_IN}`);
    await this.waitForElement(this.userMenu, TIMEOUTS.LONG);
  }

  async verifyAdminLoggedIn() {
    logger.info(`Verifying ${APP_TEXT.ADMIN_LOGGED_IN}`);
    await this.waitForElement(this.adminMenu, TIMEOUTS.EXTRA_LONG);
  }

  async verifyTogglePasswordVisibility() {
    logger.info(`Verifying ${APP_TEXT.PASSWORD_TOGGLE}`);
    await this.fill(this.passwordInput, TEST_VALUES.PASSWORD_TOGGLE);
    await this.expectHasAttribute(this.passwordInput, "type", TEST_VALUES.PASSWORD_INPUT_TYPE);

    logger.info(`Clicking ${APP_TEXT.SHOW_PASSWORD}`);
    await this.click(this.togglePassword);
    await this.expectHasAttribute(
      this.passwordInput,
      "type",
      TEST_VALUES.PASSWORD_VISIBLE_INPUT_TYPE,
    );

    logger.info(`Clicking ${APP_TEXT.HIDE_PASSWORD}`);
    await this.click(this.togglePassword);
    await this.expectHasAttribute(this.passwordInput, "type", TEST_VALUES.PASSWORD_INPUT_TYPE);
  }

  async verifySessionExpiredMessage() {
    logger.info(`Verifying ${APP_TEXT.SESSION_EXPIRED_MESSAGE}`);
    await this.expectVisible(this.sessionExpiredMsg);
  }
}

module.exports = { LoginPage };

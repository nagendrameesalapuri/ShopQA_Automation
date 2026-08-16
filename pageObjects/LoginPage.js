const { BasePage } = require("./BasePage");
const { TIMEOUTS } = require("../constants/timeouts");
const logger = require("../utils/logger");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByTestId("input-email");
    this.loginForm = page.locator("[data-testid='login-form']");
    this.passwordInput = page.getByTestId("input-password");
    this.signInButton = page.getByRole("button", { name: "Sign In" });
    this.rememberMeCheckbox = page.locator("input[type='checkbox']");
    this.togglePassword = page.locator("[data-testid='toggle-password']");
    this.emailError = page.getByTestId("email-error");
    this.passwordError = page.getByTestId("password-error");
    this.loginError = page.getByTestId("login-error");
    this.userMenu = page.getByTestId("user-menu-btn");
    this.adminMenu = page.getByTestId("admin-dashboard");
    this.sessionExpiredMsg = page.getByTestId("session-expired-msg");
    this.forgotPasswordLink = page.getByRole("link", {
      name: "Forgot Password?",
    });
  }

  async navigate() {
    logger.info("Navigating to login page");
    await this.page.goto("/login");
  }

  async navigateToExpiredSession() {
    logger.info("Navigating to login page with expired session");
    await this.page.goto("/login?expired=true");
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

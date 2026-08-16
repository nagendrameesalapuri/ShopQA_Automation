const { BasePage } = require("./BasePage");
const { expect } = require("@playwright/test");
const logger = require("../utils/logger");
const { CustomAssertions } = require("../utils/assertions");

class RegistrationPage extends BasePage {
  constructor(page) {
    super(page);
    this.requiredError = page.locator(".form-error");
    this.registrationForm = page.locator("[data-testid='register-form']");
    this.firstNameInput = page.getByTestId("input-reg-first-name");
    this.lastNameInput = page.getByTestId("input-reg-last-name");
    this.emailInput = page.locator("[data-testid='input-reg-email']");
    this.password = page.locator("[data-testid='input-reg-password']");
    this.confirmPassword = page.getByTestId("input-reg-confirm-password");
    this.phone = page.getByTestId("input-reg-phone");
    this.createAccountButton = page.getByRole("button", { name: "Create Account" });
    this.signIn = page.getByRole("link", { name: "Sign in" });
    this.passwordStrength = page.getByTestId("password-strength");
    this.confirmPasswordError = page.getByTestId("confirm-password-error");
    this.registrationSuccessMsg = page.getByText(
      "Registration successful! Please verify your email.",
    );
  }

  async navigateToRegistrationPage() {
    await this.page.goto("/register");
  }

  async verifyRegistrationFormVisible() {
    await this.expectAllVisible([
      this.registrationForm,
      this.firstNameInput,
      this.lastNameInput,
      this.emailInput,
      this.password,
      this.confirmPassword,
      this.phone,
      this.createAccountButton,
      this.signIn,
    ]);
  }

  async clickOnCreateAccount() {
    await this.click(this.createAccountButton);
  }

  async verifyEmptyFormValidation() {
    //await expect(this.requiredError).toHaveCount(4);
    //await expect(this.requiredError.first()).toBeVisible();
    await CustomAssertions.expectElementCount(this.requiredError, 4);
  }

  async signupWith(firstName, lastName, email, password, confirmPassword, phone) {
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.emailInput, email);
    await this.fill(this.password, password);
    await this.fill(this.confirmPassword, confirmPassword);
    await this.fill(this.phone, phone);
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

  async verifyCustomerRegistered() {
    await this.expectVisible(this.registrationSuccessMsg);
  }
}

module.exports = { RegistrationPage };

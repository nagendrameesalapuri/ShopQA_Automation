const { test } = require("@playwright/test");
const { POManager } = require("../pageObjects/POManager");
const logger = require("../utils/logger");
const { registerData } = require("../testData/registerData");

test.describe("Registration Tests", () => {
  let registrationPage;

  test.beforeEach(async ({ page }) => {
    const poManager = new POManager(page);
    registrationPage = poManager.getRegistrationPage();
    await registrationPage.navigateToRegistrationPage();
  });

  test("@smoke @registration should display registration form with all elements", async () => {
    await logger.testStart("should display registration form with all elements");
    await registrationPage.verifyRegistrationFormVisible();
    await logger.testPass("should display registration form with all elements");
  });

  test("@regression @registration should show validation errors for empty form", async ({
    page,
  }) => {
    await logger.testStart("should show validation errors for empty form");
    await registrationPage.clickOnCreateAccount();
    await registrationPage.verifyEmptyFormValidation();
    await logger.testPass("should show validation errors for empty registration form");
  });

  test("@regression @registration should show error for invalid email format", async ({ page }) => {
    await logger.testStart("should show error for invalid email format");
    await registrationPage.signupWith(
      registerData.invalidEmail.firstName,
      registerData.invalidEmail.lastName,
      registerData.invalidEmail.email,
      registerData.invalidEmail.password,
      registerData.invalidEmail.confirmPassword,
      registerData.invalidEmail.phone,
    );
    await registrationPage.verifyInvalidEmailError();
    await logger.testPass("should show error for invalid email format for registration page");
  });

  test("@regression @registration should show validation for weak password", async ({ page }) => {
    await logger.testStart("should show validation for weak password");
    await registrationPage.signupWith(
      registerData.shortPassword.firstName,
      registerData.shortPassword.lastName,
      registerData.shortPassword.email,
      registerData.shortPassword.password,
      registerData.shortPassword.confirmPassword,
      registerData.shortPassword.phone,
    );
    await registrationPage.verifyWeakPassword();
    await logger.testPass("should show validation for weak password");
  });

  test("@regression @registration should fail if passwords do not match", async () => {
    await logger.testStart("should fail if passwords do not match");
    await registrationPage.signupWith(
      registerData.passwordMismatch.firstName,
      registerData.passwordMismatch.lastName,
      registerData.passwordMismatch.email,
      registerData.passwordMismatch.password,
      registerData.passwordMismatch.confirmPassword,
      registerData.passwordMismatch.phone,
    );
    await registrationPage.verifyPasswordMismatchError();
    await logger.testPass("should fail if passwords do not match");
  });

  test("@regression @registration should successfully registered as customer", async () => {
    await logger.testStart("should successfully registered as customer");
    await registrationPage.signupWith(
      registerData.validUser.firstName,
      registerData.validUser.lastName,
      registerData.validUser.email,
      registerData.validUser.password,
      registerData.validUser.confirmPassword,
      registerData.validUser.phone,
    );
    await registrationPage.verifyCustomerRegistered();
    await logger.testPass("should successfully registered as customer");
  });
});

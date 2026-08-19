const { test } = require("@playwright/test");
const { POManager } = require("../pageObjects/POManager");
const logger = require("../utils/logger");
const { createValidUser, registerData } = require("../testData/registerData");

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

  test("@regression @registration should show validation errors for empty form", async () => {
    logger.testStart("should show validation errors for empty form");
    await registrationPage.clickCreateAccount();
    await registrationPage.verifyEmptyFormValidation();
    logger.testPass("should show validation errors for empty registration form");
  });

  test("@regression @registration should show error for invalid email format", async () => {
    logger.testStart("should show error for invalid email format");
    await registrationPage.signupWith(
      registerData.invalidEmail.firstName,
      registerData.invalidEmail.lastName,
      registerData.invalidEmail.email,
      registerData.invalidEmail.password,
      registerData.invalidEmail.confirmPassword,
      registerData.invalidEmail.phone,
    );
    await registrationPage.verifyInvalidEmailError();
    logger.testPass("should show error for invalid email format for registration page");
  });

  test("@regression @registration should show validation for weak password", async () => {
    logger.testStart("should show validation for weak password");
    await registrationPage.signupWith(
      registerData.shortPassword.firstName,
      registerData.shortPassword.lastName,
      registerData.shortPassword.email,
      registerData.shortPassword.password,
      registerData.shortPassword.confirmPassword,
      registerData.shortPassword.phone,
    );
    await registrationPage.verifyWeakPassword();
    logger.testPass("should show validation for weak password");
  });

  test("@regression @registration should fail if passwords do not match", async () => {
    logger.testStart("should fail if passwords do not match");
    await registrationPage.signupWith(
      registerData.passwordMismatch.firstName,
      registerData.passwordMismatch.lastName,
      registerData.passwordMismatch.email,
      registerData.passwordMismatch.password,
      registerData.passwordMismatch.confirmPassword,
      registerData.passwordMismatch.phone,
    );
    await registrationPage.verifyPasswordMismatchError();
    logger.testPass("should fail if passwords do not match");
  });

  test("@regression @registration should successfully register a customer", async () => {
    logger.testStart("should successfully register a customer");
    const validUser = createValidUser();
    await registrationPage.signupWith(
      validUser.firstName,
      validUser.lastName,
      validUser.email,
      validUser.password,
      validUser.confirmPassword,
      validUser.phone,
    );
    await registrationPage.verifyRegistrationSuccess();
    logger.testPass("should successfully register a customer");
  });
});

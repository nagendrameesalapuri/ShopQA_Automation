const { test } = require("@playwright/test");
const { POManager } = require("../../pageObjects/POManager");
const { loginData } = require("../../testData/loginData");
const logger = require("../../utils/logger");

test.describe("Login Tests", () => {
  let loginPage;

  test.beforeEach(async ({ page }) => {
    const poManager = new POManager(page);
    loginPage = poManager.getLoginPage();
    await loginPage.navigate();
  });

  test("@smoke @login should display login form with all elements", async () => {
    logger.testStart("should display login form with all elements");
    await loginPage.verifyLoginFormVisible();
    logger.testPass("should display login form with all elements");
  });

  test("@regression @login should show validation errors for empty form", async () => {
    logger.testStart("should show validation errors for empty form");
    await loginPage.clickLogin();
    await loginPage.verifyEmptyFormValidation();
    logger.testPass("should show validation errors for empty form");
  });

  test("@regression @login should show error for invalid email format", async () => {
    logger.testStart("should show error for invalid email format");
    await loginPage.enterEmail(loginData.invalidEmail.email);
    await loginPage.enterPassword(loginData.invalidEmail.password);
    await loginPage.clickLogin();
    await loginPage.verifyInvalidEmailError();
    logger.testPass("should show error for invalid email format");
  });

  test("@regression @login should show error for wrong credentials", async () => {
    logger.testStart("should show error for wrong credentials");
    await loginPage.enterEmail(loginData.invalidUser.email);
    await loginPage.enterPassword(loginData.invalidUser.password);
    await loginPage.clickLogin();
    await loginPage.verifyLoginError();
    logger.testPass("should show error for wrong credentials");
  });

  test("@smoke @login should successfully login as customer", async () => {
    logger.testStart("should successfully login as customer");
    await loginPage.loginAs(loginData.customer.email, loginData.customer.password);
    await loginPage.verifyCustomerLoggedIn();
    logger.testPass("should successfully login as customer");
  });

  test("@smoke @login should successfully login as admin and redirect to admin", async () => {
    logger.testStart("should successfully login as admin and redirect to admin");
    await loginPage.loginAs(loginData.admin.email, loginData.admin.password);
    await loginPage.verifyAdminLoggedIn();
    logger.testPass("should successfully login as admin and redirect to admin");
  });

  test("@regression @login should toggle password visibility", async () => {
    logger.testStart("should toggle password visibility");
    await loginPage.verifyTogglePasswordVisibility();
    logger.testPass("should toggle password visibility");
  });

  test("@regression @login should show session expired message", async () => {
    logger.testStart("should show session expired message");
    await loginPage.navigateToExpiredSession();
    await loginPage.verifySessionExpiredMessage();
    logger.testPass("should show session expired message");
  });
});

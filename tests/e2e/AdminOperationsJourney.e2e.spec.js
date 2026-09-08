const { test } = require("@playwright/test");
const { POManager } = require("../../pageObjects/POManager");
const logger = require("../../utils/logger");

test.describe("@e2e @admin E2E: Admin operations journey", () => {
  test("admin can inspect dashboard and open product management", async ({ page }) => {
    const testName = "admin can inspect dashboard and open product management";
    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
    const adminPage = poManager.getAdminPage();

    logger.testStart(testName);
    await loginPage.navigate();
    await loginPage.loginAs("admin");
    await adminPage.navigateToAdminDashboard();
    await adminPage.verifyDashboardStatsVisible();
    await adminPage.verifyOrdersTableVisible();
    await adminPage.navigateToProductsFromSidebar();
    await adminPage.openAddProductModal();
    await adminPage.verifyImageDropzoneVisible();
    await adminPage.closeProductModal();
    logger.testPass(testName);
  });

  test("admin can reject a duplicate coupon code", async ({ page }) => {
    const testName = "admin can reject a duplicate coupon code";
    const poManager = new POManager(page);
    const loginPage = poManager.getLoginPage();
    const adminPage = poManager.getAdminPage();

    logger.testStart(testName);
    await loginPage.navigate();
    await loginPage.loginAs("admin");
    await adminPage.navigateToCouponsPage();
    await adminPage.openCreateCouponForm();
    await adminPage.createCoupon({
      code: "WELCOME10",
      type: "percentage",
      value: "5",
      limit: "100",
    });
    await adminPage.verifyDuplicateCouponError();
    logger.testPass(testName);
  });
});

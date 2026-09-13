const { test } = require("@playwright/test");
const { POManager } = require("../../pageObjects/POManager");
const { AdminData } = require("../../testData/AdminData");
const logger = require("../../utils/logger");

test.describe("@admin Admin Panel", () => {
  let loginPage;
  let adminPage;

  test.beforeEach(async ({ page }) => {
    const poManager = new POManager(page);
    loginPage = poManager.getLoginPage();
    adminPage = poManager.getAdminPage();
    await loginPage.navigate();
    await loginPage.loginAs("admin");
    await adminPage.navigateToAdminDashboard();
  });

  test("@smoke @sanity should display dashboard stats", async () => {
    const testName = "should display dashboard stats";
    logger.testStart(testName);
    await adminPage.verifyDashboardStatsVisible();
    logger.testPass(testName);
  });

  test("@sanity should navigate to products page", async ({ page }) => {
    const testName = "should navigate to products page";
    logger.testStart(testName);
    await adminPage.navigateToProductsFromSidebar();
    await page.waitForURL(/\/admin\/products$/);
    logger.testPass(testName);
  });

  test("@regression should show orders table", async () => {
    const testName = "should show orders table";
    logger.testStart(testName);
    await adminPage.verifyOrdersTableVisible();
    logger.testPass(testName);
  });

  test("@regression should deny access to non-admin user", async () => {
    const testName = "should deny access to non-admin user";
    logger.testStart(testName);
    await loginPage.logout();
    await loginPage.navigate();
    await loginPage.loginAs("customer");
    await adminPage.navigateToAdminDashboard();
    await adminPage.verifyAccessDenied();
    logger.testPass(testName);
  });

  test.describe("Product Management", () => {
    test("@regression should open add product modal", async () => {
      const testName = "should open add product modal";
      logger.testStart(testName);
      await adminPage.navigateToProductsPage();
      await adminPage.openAddProductModal();
      logger.testPass(testName);
    });

    test("@regression should validate product form", async () => {
      const testName = "should validate product form";
      logger.testStart(testName);
      await adminPage.navigateToProductsPage();
      await adminPage.openAddProductModal();
      await adminPage.saveProduct();
      await adminPage.verifyProductNameValidation();
      logger.testPass(testName);
    });

    test("@regression should show product image dropzone", async () => {
      const testName = "should show product image dropzone";
      logger.testStart(testName);
      await adminPage.navigateToProductsPage();
      await adminPage.openAddProductModal();
      await adminPage.verifyImageDropzoneVisible();
      logger.testPass(testName);
    });
  });

  test.describe("Coupon Management", () => {
    test("@regression should create a new coupon", async () => {
      const testName = "should create a new coupon";
      const coupon = AdminData.coupons.newCoupon;
      logger.testStart(testName);
      await adminPage.navigateToCouponsPage();
      await adminPage.openCreateCouponForm();
      await adminPage.createCoupon(coupon);
      await adminPage.verifyCouponVisible(coupon.code);
      logger.testPass(testName);
    });

    test("@regression should prevent duplicate coupon codes", async () => {
      const testName = "should prevent duplicate coupon codes";
      const coupon = AdminData.coupons.existingCoupon;
      logger.testStart(testName);
      await adminPage.navigateToCouponsPage();
      await adminPage.openCreateCouponForm();
      await adminPage.createCoupon(coupon);
      await adminPage.verifyDuplicateCouponError();
      logger.testPass(testName);
    });
  });
});

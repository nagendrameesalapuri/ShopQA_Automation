const { expect } = require("@playwright/test");
const { SELECTORS } = require("../constants/selectors");
const { ROUTES } = require("../constants/routes");
const { BasePage } = require("./BasePage");
const logger = require("../utils/logger");

class AdminPage extends BasePage {
  constructor(page) {
    super(page);
    this.statsGrid = page.locator(SELECTORS.ADMIN_STATS_GRID);
    this.totalRevenue = page.locator(SELECTORS.ADMIN_TOTAL_REVENUE);
    this.totalOrders = page.locator(SELECTORS.ADMIN_TOTAL_ORDERS);
    this.totalUsers = page.locator(SELECTORS.ADMIN_TOTAL_USERS);
    this.sidebarProducts = page.locator(SELECTORS.ADMIN_SIDEBAR_PRODUCTS);
    this.ordersTable = page.locator(SELECTORS.ADMIN_ORDERS_TABLE);
    this.accessDenied = page.locator(SELECTORS.ADMIN_ACCESS_DENIED);
    this.addProductButton = page.locator(SELECTORS.ADMIN_ADD_PRODUCT_BUTTON);
    this.productFormModal = page.locator(SELECTORS.ADMIN_PRODUCT_FORM_MODAL);
    this.closeModalButton = page.locator(SELECTORS.ADMIN_CLOSE_MODAL_BUTTON);
    this.saveProductButton = page.locator(SELECTORS.ADMIN_SAVE_PRODUCT_BUTTON);
    this.productNameError = page.locator(SELECTORS.ADMIN_PRODUCT_NAME_ERROR);
    this.imageDropzone = page.locator(SELECTORS.ADMIN_IMAGE_DROPZONE);
    this.createCouponButton = page.locator(SELECTORS.ADMIN_CREATE_COUPON_BUTTON);
    this.couponCode = page.locator(SELECTORS.ADMIN_COUPON_CODE);
    this.couponType = page.locator(SELECTORS.ADMIN_COUPON_TYPE);
    this.couponValue = page.locator(SELECTORS.ADMIN_COUPON_VALUE);
    this.couponLimit = page.locator(SELECTORS.ADMIN_COUPON_LIMIT);
    this.saveCouponButton = page.locator(SELECTORS.ADMIN_SAVE_COUPON_BUTTON);
    this.errorToast = page.locator(SELECTORS.ADMIN_ERROR_TOAST);
  }

  async navigateToAdminDashboard() {
    logger.info("Navigating to admin dashboard");
    await this.navigate(ROUTES.ADMIN);
  }

  async navigateToProductsPage() {
    logger.info("Navigating to admin products page");
    await this.navigate(ROUTES.ADMIN_PRODUCTS);
  }

  async navigateToCouponsPage() {
    logger.info("Navigating to admin coupons page");
    await this.navigate(ROUTES.ADMIN_COUPONS);
  }

  async verifyDashboardStatsVisible() {
    logger.info("Verifying admin dashboard statistics");
    await this.expectAllVisible([
      this.statsGrid,
      this.totalRevenue,
      this.totalOrders,
      this.totalUsers,
    ]);
  }

  async navigateToProductsFromSidebar() {
    logger.info("Opening products from admin sidebar");
    await this.click(this.sidebarProducts);
  }

  async verifyOrdersTableVisible() {
    logger.info("Verifying admin orders table is visible");
    await this.expectVisible(this.ordersTable);
  }

  async verifyAccessDenied() {
    logger.info("Verifying admin access is denied");
    await this.expectVisible(this.accessDenied);
  }

  async openAddProductModal() {
    logger.info("Opening add product modal");
    await this.click(this.addProductButton);
    await this.expectVisible(this.productFormModal);
  }

  async saveProduct() {
    logger.info("Saving product form");
    await this.click(this.saveProductButton);
  }

  async verifyProductNameValidation() {
    logger.info("Verifying product name validation");
    await this.expectVisible(this.productNameError);
  }

  async verifyImageDropzoneVisible() {
    logger.info("Verifying product image dropzone is visible");
    await this.expectVisible(this.imageDropzone);
  }

  async verifyDropzoneDragOver() {
    logger.info("Verifying image dropzone drag-over state");
    await this.expectVisible(this.imageDropzone);
    await this.imageDropzone.evaluate((element) => {
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(new File(["test"], "test.png", { type: "image/png" }));
      element.dispatchEvent(new DragEvent("dragover", { bubbles: true, dataTransfer }));
    });
    await expect(this.imageDropzone).toHaveClass(/drag-over/);
  }

  async closeProductModal() {
    logger.info("Closing product form modal");
    await this.click(this.closeModalButton);
    await expect(this.productFormModal).not.toBeVisible();
  }

  async openCreateCouponForm() {
    logger.info("Opening create coupon form");
    await this.click(this.createCouponButton);
  }

  async createCoupon({ code, type, value, limit }) {
    logger.info(`Creating coupon: ${code}`);
    await this.fill(this.couponCode, code);
    await this.selectDropdown(this.couponType, type);
    await this.fill(this.couponValue, value);
    await this.fill(this.couponLimit, limit);
    await this.click(this.saveCouponButton);
  }

  async verifyCouponVisible(code) {
    logger.info(`Verifying coupon is visible: ${code}`);
    await this.expectVisible(this.page.getByText(code, { exact: true }));
  }

  async verifyDuplicateCouponError() {
    logger.info("Verifying duplicate coupon error");
    await this.expectVisible(this.errorToast);
  }
}

module.exports = { AdminPage };

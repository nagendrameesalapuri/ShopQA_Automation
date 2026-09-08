const { expect } = require("@playwright/test");
const { SELECTORS } = require("../constants/selectors");
const { ROUTES } = require("../constants/routes");
const { BasePage } = require("./BasePage");
const logger = require("../utils/logger");

class OrdersPage extends BasePage {
  constructor(page) {
    super(page);
    this.ordersPage = page.locator(SELECTORS.ORDERS_PAGE);
    this.statusFilter = page.locator(SELECTORS.ORDER_STATUS_FILTER);
    this.orderStatusBadges = page.locator(SELECTORS.ORDER_STATUS_BADGE);
    this.emptyState = page.locator(SELECTORS.ORDERS_EMPTY_STATE);
  }

  async navigateToOrdersPage() {
    logger.info("Navigating to orders page");
    await this.navigate(ROUTES.ORDERS);
  }

  async verifyOrdersPageVisible() {
    logger.info("Verifying orders page is visible");
    await expect(this.ordersPage).toBeVisible();
  }

  async filterOrdersByStatus(status) {
    logger.info(`Filtering orders by status: ${status}`);
    await this.selectDropdown(this.statusFilter, status);
  }

  async verifyAllOrdersHaveStatus(expectedStatus) {
    logger.info(`Verifying all visible orders have status: ${expectedStatus}`);
    await expect(this.orderStatusBadges.first().or(this.emptyState)).toBeVisible();
    const orderCount = await this.orderStatusBadges.count();

    if (orderCount === 0) {
      await expect(this.emptyState).toBeVisible();
      logger.info(`No orders found for status: ${expectedStatus}`);
      return;
    }

    await expect(this.orderStatusBadges.first()).toBeVisible();

    const statuses = await this.orderStatusBadges.allTextContents();

    for (const status of statuses) {
      expect(status.trim().toLowerCase()).toContain(expectedStatus.toLowerCase());
    }
  }
}

module.exports = { OrdersPage };

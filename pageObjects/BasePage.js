const { expect } = require("@playwright/test");
const { TIMEOUTS } = require("../constants/timeouts");

class BasePage {
  constructor(page) {
    this.page = page;
  }

  // ==================== Navigation ====================

  async navigate(path = "") {
    await this.page.goto(path);
  }

  async navigateBack() {
    await this.page.goBack();
  }

  async navigateForward() {
    await this.page.goForward();
  }

  async reload() {
    await this.page.reload();
  }

  // ==================== Wait Methods ====================

  async waitForElement(locator, timeout = TIMEOUTS.DEFAULT) {
    await locator.waitFor({ state: "visible", timeout });
  }

  async waitForElementHidden(locator, timeout = TIMEOUTS.DEFAULT) {
    await locator.waitFor({ state: "hidden", timeout });
  }

  async waitForNavigation(options = {}) {
    await this.page.waitForNavigation({
      waitUntil: "networkidle",
      ...options,
    });
  }

  async waitForURL(urlMatcher) {
    await this.page.waitForURL(urlMatcher);
  }

  // ==================== Click/Interaction Methods ====================

  async click(locator) {
    await locator.click();
  }

  async doubleClick(locator) {
    await locator.dblclick();
  }

  async rightClick(locator) {
    await locator.click({ button: "right" });
  }

  async fill(locator, value) {
    await locator.clear();
    await locator.fill(value);
  }

  async type(locator, text, delay = 50) {
    await locator.type(text, { delay });
  }

  async selectDropdown(locator, value) {
    await locator.selectOption(value);
  }

  async check(locator) {
    await locator.check();
  }

  async uncheck(locator) {
    await locator.uncheck();
  }

  async hover(locator) {
    await locator.hover();
  }

  async press(locator, key) {
    await locator.press(key);
  }

  // ==================== Assertion Methods ====================

  async expectVisible(locator) {
    await expect(locator).toBeVisible();
  }

  async expectHidden(locator) {
    await expect(locator).toBeHidden();
  }

  async expectEnabled(locator) {
    await expect(locator).toBeEnabled();
  }

  async expectDisabled(locator) {
    await expect(locator).toBeDisabled();
  }

  async expectContainsText(locator, text) {
    await expect(locator).toContainText(text);
  }

  async expectNotContainsText(locator, text) {
    await expect(locator).not.toContainText(text);
  }

  async expectHasText(locator, text) {
    await expect(locator).toHaveText(text);
  }

  async expectHasValue(locator, value) {
    await expect(locator).toHaveValue(value);
  }

  async expectHasAttribute(locator, attribute, value) {
    await expect(locator).toHaveAttribute(attribute, value);
  }

  async expectAllVisible(locators) {
    for (const locator of locators) {
      await expect(locator).toBeVisible();
    }
  }

  async expectURLContains(urlMatch) {
    await expect(this.page).toHaveURL(new RegExp(urlMatch));
  }

  async expectTitleContains(title) {
    await expect(this.page).toHaveTitle(new RegExp(title));
  }

  // ==================== Utility Methods ====================

  async getText(locator) {
    return await locator.textContent();
  }

  async getAttribute(locator, attribute) {
    return await locator.getAttribute(attribute);
  }

  async getElementCount(locator) {
    return await locator.count();
  }

  async isVisible(locator) {
    return await locator.isVisible();
  }

  async isEnabled(locator) {
    return await locator.isEnabled();
  }

  async isChecked(locator) {
    return await locator.isChecked();
  }

  async takeScreenshot(filename = null) {
    const path = filename || `screenshot-${Date.now()}.png`;
    await this.page.screenshot({ path });
  }

  async scrollToElement(locator) {
    await locator.scrollIntoViewIfNeeded();
  }

  async scrollToTop() {
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async scrollToBottom() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  getURL() {
    return this.page.url();
  }

  async getTitle() {
    return await this.page.title();
  }

  // ==================== Logging ====================

  log(message) {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }

  logError(message) {
    console.error(`[${new Date().toISOString()}] ERROR: ${message}`);
  }

  logWarn(message) {
    console.warn(`[${new Date().toISOString()}] WARN: ${message}`);
  }
}

module.exports = { BasePage };

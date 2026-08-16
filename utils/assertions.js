const { expect } = require("@playwright/test");

/**
 * Advanced Custom Assertions for specialized testing scenarios
 *
 * NOTE: For basic assertions (visible, enabled, text, etc.), use BasePage methods:
 * - this.expectVisible(locator)
 * - this.expectContainsText(locator, text)
 * - this.expectAllVisible(locators)
 * - etc.
 *
 * This class focuses on specialized assertions used in test files
 */
class CustomAssertions {
  /**
   * Verify exact element count matches expected
   * Useful for checking table rows, list items, etc.
   *
   * @param {Locator} locator - The locator to count elements
   * @param {number} expectedCount - Expected number of elements
   *
   * @example
   * await CustomAssertions.expectElementCount(page.locator("tr"), 5);
   */
  static async expectElementCount(locator, expectedCount) {
    const elements = await locator.all();
    expect(elements).toHaveLength(expectedCount);
  }

  /**
   * Verify element has specific CSS class
   * Useful for checking active states, error states, etc.
   *
   * @param {Locator} element - The element locator
   * @param {string} className - The CSS class name to check
   *
   * @example
   * await CustomAssertions.expectElementHasClass(loginBtn, "active");
   */
  static async expectElementHasClass(element, className) {
    const classes = await element.getAttribute("class");
    expect(classes).toContain(className);
  }

  /**
   * Verify element does NOT have specific CSS class
   * Useful for verifying removed classes or inactive states.
   *
   * @param {Locator} element - The element locator
   * @param {string} className - The CSS class name to verify absence
   *
   * @example
   * await CustomAssertions.expectElementNotHasClass(loginBtn, "disabled");
   */
  static async expectElementNotHasClass(element, className) {
    const classes = await element.getAttribute("class");
    expect(classes).not.toContain(className);
  }

  /**
   * Verify form has no visible error messages
   * Used to validate that all form validations pass.
   *
   * @param {Array<Locator>} errorElements - Array of error message locators
   *
   * @example
   * await CustomAssertions.expectFormValid([
   *   loginPage.emailError,
   *   loginPage.passwordError,
   *   loginPage.loginError
   * ]);
   */
  static async expectFormValid(errorElements) {
    for (const errorElement of errorElements) {
      await expect(errorElement).not.toBeVisible();
    }
  }

  /**
   * Verify API response has expected status code
   * Used for API testing and network response validation.
   *
   * @param {Response} response - The Playwright response object
   * @param {number} statusCode - Expected HTTP status code
   *
   * @example
   * const response = await page.waitForResponse(resp => resp.url().includes('/login'));
   * CustomAssertions.expectResponseStatus(response, 200);
   */
  static expectResponseStatus(response, statusCode) {
    expect(response.status()).toBe(statusCode);
  }

  /**
   * Verify element exists in viewport
   * Used to ensure element is scrollable/visible on screen.
   *
   * @param {Locator} element - The element locator
   *
   * @example
   * await CustomAssertions.expectElementInViewport(page.locator(".footer"));
   */
  static async expectElementInViewport(element) {
    const box = await element.boundingBox();
    expect(box).not.toBeNull();
  }

  /**
   * Verify element attribute matches expected value with custom message
   * More detailed assertion with better error messages.
   *
   * @param {Locator} element - The element locator
   * @param {string} attribute - The attribute name
   * @param {string|RegExp} expectedValue - Expected value or pattern
   *
   * @example
   * await CustomAssertions.expectAttributeMatches(emailInput, "type", "email");
   */
  static async expectAttributeMatches(element, attribute, expectedValue) {
    const actualValue = await element.getAttribute(attribute);
    if (expectedValue instanceof RegExp) {
      expect(actualValue).toMatch(expectedValue);
    } else {
      expect(actualValue).toBe(expectedValue);
    }
  }

  /**
   * Verify element has multiple specific classes
   * Useful for Tailwind or utility-based CSS frameworks.
   *
   * @param {Locator} element - The element locator
   * @param {Array<string>} classNames - Array of class names to verify
   *
   * @example
   * await CustomAssertions.expectElementHasClasses(button, ["btn", "btn-primary", "active"]);
   */
  static async expectElementHasClasses(element, classNames) {
    const classes = (await element.getAttribute("class")) || "";
    for (const className of classNames) {
      expect(classes).toContain(className);
    }
  }
}

module.exports = { CustomAssertions };

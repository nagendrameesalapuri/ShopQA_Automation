# Assertion Strategy Guide

## Overview

This project uses a **two-tier assertion system** to keep code organized and maintainable.

---

## 🎯 Tier 1: BasePage Assertions (Page Object Level)

**Location:** `pageObjects/BasePage.js`

**Usage:** Use in **all page objects** for basic, common assertions

**Type:** Instance methods - accessed via `this` keyword

### Available Methods

```javascript
// Element visibility
await this.expectVisible(locator);
await this.expectHidden(locator);

// Element state
await this.expectEnabled(locator);
await this.expectDisabled(locator);

// Text & attributes
await this.expectContainsText(locator, text);
await this.expectHasText(locator, text);
await this.expectHasAttribute(locator, attribute, value);

// Multiple elements
await this.expectAllVisible([locator1, locator2, locator3]);

// Page level
await this.expectURLContains(urlMatch);
await this.expectTitleContains(title);
```

### When to Use

```javascript
class LoginPage extends BasePage {
  async verifyLoginFormVisible() {
    // ✅ Use BasePage assertions
    await this.expectVisible(this.loginForm);
    await this.expectAllVisible([this.emailInput, this.passwordInput, this.signInButton]);
  }

  async verifyValidationErrors() {
    // ✅ Use BasePage assertions
    await this.expectContainsText(this.emailError, "required");
    await this.expectHasAttribute(this.emailInput, "type", "email");
  }
}
```

---

## 🚀 Tier 2: CustomAssertions (Test Level)

**Location:** `utils/assertions.js`

**Usage:** Use in **test files** for specialized, advanced assertions

**Type:** Static methods - accessed via `CustomAssertions.methodName()`

### Available Methods

```javascript
const { CustomAssertions } = require("../utils/assertions");

// Count verification
await CustomAssertions.expectElementCount(locator, 5);

// CSS class validation
await CustomAssertions.expectElementHasClass(button, "active");
await CustomAssertions.expectElementNotHasClass(input, "disabled");
await CustomAssertions.expectElementHasClasses(button, ["btn", "primary"]);

// Form validation
await CustomAssertions.expectFormValid([loginPage.emailError, loginPage.passwordError]);

// API/Response validation
CustomAssertions.expectResponseStatus(response, 200);

// Viewport checks
await CustomAssertions.expectElementInViewport(footer);

// Attribute matching
await CustomAssertions.expectAttributeMatches(input, "type", "email");
```

### When to Use

```javascript
const { test } = require("@playwright/test");
const { POManager } = require("../pageObjects/POManager");
const { CustomAssertions } = require("../utils/assertions");

test("verify login form validation", async ({ page }) => {
  const poManager = new POManager(page);
  const loginPage = poManager.getLoginPage();

  // ✅ Use CustomAssertions for test-level checks
  await CustomAssertions.expectFormValid([
    loginPage.emailError,
    loginPage.passwordError,
    loginPage.loginError,
  ]);

  // ✅ Use CustomAssertions for counts
  const errorCount = await page.locator(".error").count();
  await CustomAssertions.expectElementCount(page.locator(".error"), 2);

  // ✅ Use CustomAssertions for CSS validation
  await CustomAssertions.expectElementHasClass(loginPage.signInButton, "disabled");
});
```

---

## 📊 Quick Reference Table

| Assertion Type                     | Location      | How to Use                                   | Best For     |
| ---------------------------------- | ------------- | -------------------------------------------- | ------------ |
| **Basic (Visible, Enabled, Text)** | BasePage.js   | `await this.expectVisible()`                 | Page objects |
| **Multiple Elements**              | BasePage.js   | `await this.expectAllVisible([])`            | Page objects |
| **Page Level (URL, Title)**        | BasePage.js   | `await this.expectURLContains()`             | Page objects |
| **Count Checking**                 | assertions.js | `CustomAssertions.expectElementCount()`      | Test files   |
| **CSS Classes**                    | assertions.js | `CustomAssertions.expectElementHasClass()`   | Test files   |
| **Form Validation**                | assertions.js | `CustomAssertions.expectFormValid()`         | Test files   |
| **API Responses**                  | assertions.js | `CustomAssertions.expectResponseStatus()`    | Test files   |
| **Viewport Checks**                | assertions.js | `CustomAssertions.expectElementInViewport()` | Test files   |

---

## 📝 Real-World Examples

### Example 1: Page Object (Use BasePage)

```javascript
const { BasePage } = require("./BasePage");
const logger = require("../utils/logger");

class LoginPage extends BasePage {
  constructor(page) {
    super(page);
    this.emailInput = page.getByTestId("input-email");
    this.loginForm = page.locator("[data-testid='login-form']");
    this.emailError = page.getByTestId("email-error");
  }

  async verifyLoginFormVisible() {
    logger.info("Verifying login form is visible");

    // ✅ Use BasePage assertions
    await this.expectVisible(this.loginForm);
    await this.expectContainsText(this.emailError, "required");
  }
}
```

### Example 2: Test File (Use CustomAssertions)

```javascript
const { test } = require("@playwright/test");
const { POManager } = require("../pageObjects/POManager");
const { CustomAssertions } = require("../utils/assertions");
const { loginData } = require("../testData/loginData");

test("login form validation", async ({ page }) => {
  const poManager = new POManager(page);
  const loginPage = poManager.getLoginPage();

  // Navigate and verify basic form elements
  await loginPage.navigate();
  await loginPage.verifyLoginFormVisible(); // Uses BasePage internally

  // Test form with no input
  await loginPage.clickLogin();

  // ✅ Use CustomAssertions for test-level checks
  await CustomAssertions.expectFormValid([loginPage.emailError, loginPage.passwordError]);

  // Verify error count
  const errors = page.locator("[data-testid*='error']");
  await CustomAssertions.expectElementCount(errors, 2);
});
```

### Example 3: Complex Test (Mix Both)

```javascript
test("verify button states after login", async ({ page }) => {
  const poManager = new POManager(page);
  const loginPage = poManager.getLoginPage();

  // Page object level assertions
  await loginPage.navigate();
  await loginPage.verifyLoginFormVisible(); // Uses BasePage

  // Submit form
  await loginPage.loginAs(loginData.customer.email, loginData.customer.password);
  await loginPage.verifyCustomerLoggedIn(); // Uses BasePage

  // Test file level assertions
  const submitBtn = page.locator("[type='submit']");

  // ✅ CustomAssertions for CSS class checking
  await CustomAssertions.expectElementNotHasClass(submitBtn, "disabled");
  await CustomAssertions.expectElementHasClass(submitBtn, "active");

  // ✅ CustomAssertions for count
  const menuItems = page.locator("[role='menuitem']");
  await CustomAssertions.expectElementCount(menuItems, 5);
});
```

---

## ✅ Best Practices

### Do's ✅

- Use **BasePage assertions** in page objects for reusability
- Use **CustomAssertions** in test files for specialized checks
- Keep assertions **descriptive and purpose-driven**
- Document complex assertions with comments
- Use **appropriate timeout values** when needed

### Don'ts ❌

- Don't mix assertions in wrong locations
- Don't create custom assertion methods that already exist
- Don't use magic numbers in assertions (use constants)
- Don't ignore assertion failures - investigate root cause

---

## 🔄 Migration Path

If you find yourself needing an assertion:

1. **Check BasePage.js first** - Does it already exist? Use it!
2. **Check assertions.js** - Is it a specialized assertion?
3. **Use BasePage if:**
   - It's a basic element check
   - Multiple page objects need it
   - It's about individual elements
4. **Use CustomAssertions if:**
   - It's a specialized test-level check
   - Multiple tests need it
   - It involves complex logic

---

## 📚 Additional Resources

- [Playwright Assertions Docs](https://playwright.dev/docs/test-assertions)
- [BasePage Documentation](./BasePage.js)
- [CustomAssertions Documentation](./assertions.js)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)

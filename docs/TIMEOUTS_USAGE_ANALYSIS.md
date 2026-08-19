# Timeout Usage Guide

Timeout values are centralized in `constants/timeouts.js` and should be reused instead of adding numeric literals to page objects or configuration.

## Current Usage

**File: `pageObjects/LoginPage.js`**

```javascript
// Line 2: Import
const { TIMEOUTS } = require("../constants/timeouts");

// Line 130: Usage
await this.waitForElement(this.userMenu, TIMEOUTS.LONG);

// Line 138: Usage
await this.waitForElement(this.adminMenu, TIMEOUTS.EXTRA_LONG);
```

**Usage Count: 2 places** (in LoginPage.js)

---

## ❌ NOT Using TIMEOUTS (Should Be)

### 1. BasePage.js - Default Timeout Parameters

```javascript
// Current: Hard-coded timeout values
async waitForElement(locator, timeout = 5000) {
  await locator.waitFor({ state: "visible", timeout });
}

async waitForElementHidden(locator, timeout = 5000) {
  await locator.waitFor({ state: "hidden", timeout });
}

// Should use: TIMEOUTS.DEFAULT or TIMEOUTS.ELEMENT_VISIBILITY
```

### 2. playwright.config.js - Hard-Coded Timeouts

```javascript
// Current (Hard-coded):
timeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : 30 * 1000,

expect: {
  timeout: process.env.EXPECT_TIMEOUT ? parseInt(process.env.EXPECT_TIMEOUT) : 5000,
},

use: {
  actionTimeout: 10000,
},

webServer: {
  timeout: 120 * 1000,
}

// Should use: TIMEOUTS constants
```

---

## 📊 Optimization Opportunities

| File                 | Line | Current          | Should Use               | Reason                 |
| -------------------- | ---- | ---------------- | ------------------------ | ---------------------- |
| BasePage.js          | 50   | `timeout = 5000` | `TIMEOUTS.DEFAULT`       | Consistency            |
| BasePage.js          | 59   | `timeout = 5000` | `TIMEOUTS.DEFAULT`       | Consistency            |
| playwright.config.js | 16   | `30 * 1000`      | `TIMEOUTS.EXTRA_LONG`    | Single source of truth |
| playwright.config.js | 19   | `5000`           | `TIMEOUTS.DEFAULT`       | Single source of truth |
| playwright.config.js | 40   | `10000`          | `TIMEOUTS.MEDIUM`        | Single source of truth |
| playwright.config.js | 72   | `120 * 1000`     | `TIMEOUTS.FILE_DOWNLOAD` | Single source of truth |

---

## 🎯 Benefits of Full Implementation

### Current State (2 places using TIMEOUTS)

```
LoginPage.js
├─ TIMEOUTS.LONG ✅
├─ TIMEOUTS.EXTRA_LONG ✅
└─ (No other files using constants)

BasePage.js (Hard-coded: 5000, 5000)
playwright.config.js (Hard-coded: 30000, 5000, 10000, 120000)
```

### Optimal State (Everywhere using TIMEOUTS)

```
All hard-coded timeouts → TIMEOUTS constants
├─ Single source of truth
├─ Easy to adjust globally
├─ Better maintainability
├─ Consistency across project
└─ Easier testing/debugging
```

---

## 🚀 Benefits of Full Adoption

| Benefit                    | Impact                                                   |
| -------------------------- | -------------------------------------------------------- |
| **Single Source of Truth** | Change timeout once, affects everywhere                  |
| **Consistency**            | All timeouts named and centralized                       |
| **Maintainability**        | Easy to find and update timeouts                         |
| **Debugging**              | Clear timeout names in errors                            |
| **Documentation**          | Self-documenting code (e.g., `TIMEOUTS.LONG` vs `15000`) |
| **Team Alignment**         | Everyone uses same constants                             |

### Example: Debugging with TIMEOUTS vs Hard-coded

**Without TIMEOUTS (Confusing):**

```
Error: Timeout exceeded at 5000ms
       (Which 5000? Element visibility? API call? Action timeout?)
```

**With TIMEOUTS (Clear):**

```
Error: Timeout exceeded at TIMEOUTS.DEFAULT (5000ms)
       (Clearly using the default element visibility timeout)
```

---

## 📝 Recommendation

### Option 1: Light Implementation (Recommended) ⭐

Use TIMEOUTS in new code going forward:

- LoginPage: ✅ Already doing this
- New page objects: Use TIMEOUTS
- Existing code: Optional update
- **Effort:** Low
- **Benefit:** Medium

### Option 2: Full Implementation (Best Practice)

Refactor all timeouts to use TIMEOUTS:

- Update BasePage.js default parameters
- Update playwright.config.js
- Update all test files
- **Effort:** Medium
- **Benefit:** High

---

## Quick Wins (Easy Updates)

### 1. Add TIMEOUTS to BasePage

```javascript
// Top of BasePage.js
const { TIMEOUTS } = require("../constants/timeouts");

// Then update parameters:
async waitForElement(locator, timeout = TIMEOUTS.DEFAULT) {
  await locator.waitFor({ state: "visible", timeout });
}

async waitForElementHidden(locator, timeout = TIMEOUTS.DEFAULT) {
  await locator.waitFor({ state: "hidden", timeout });
}
```

### 2. Use TIMEOUTS in playwright.config.js

```javascript
const { TIMEOUTS } = require("./constants/timeouts");

module.exports = defineConfig({
  timeout: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT) : TIMEOUTS.EXTRA_LONG,

  expect: {
    timeout: process.env.EXPECT_TIMEOUT ? parseInt(process.env.EXPECT_TIMEOUT) : TIMEOUTS.DEFAULT,
  },

  use: {
    actionTimeout: TIMEOUTS.MEDIUM,
  },

  webServer: {
    timeout: TIMEOUTS.FILE_DOWNLOAD,
  },
});
```

---

## Summary

| Aspect                    | Current        | Recommendation           |
| ------------------------- | -------------- | ------------------------ |
| **Usage Rate**            | 2 places (10%) | 6+ places (90%)          |
| **Consistency**           | Partial ⚠️     | Full ✅                  |
| **Maintainability**       | Medium         | High                     |
| **Implementation Effort** | N/A            | Low-Medium               |
| **Priority**              | Medium         | Optional but recommended |

---

## Current TIMEOUTS Defined

````javascript
TIMEOUTS = {
  SHORT: 3000, // Quick operations
  DEFAULT: 5000, // Standard wait
  MEDIUM: 10000, // Navigation
  LONG: 15000, // User menu visibility
  EXTRA_LONG: 30000, // Admin dashboard visibility

  ELEMENT_VISIBILITY: 5000, // Specific: Elements
  NAVIGATION: 10000, // Specific: Page navigation
  API_CALL: 10000, // Specific: API responses
  FILE_DOWNLOAD: 30000, // Specific: File operations

  ANIMATION: 500, // Specific: CSS animations
  The configuration and page objects currently use the shared values as follows:

  - `playwright.config.js` uses `TIMEOUTS.EXTRA_LONG`, `TIMEOUTS.DEFAULT`, and `TIMEOUTS.MEDIUM`.
  - `BasePage.js` uses `TIMEOUTS.DEFAULT` for element waits.
  - `LoginPage.js` uses `TIMEOUTS.LONG` and `TIMEOUTS.EXTRA_LONG` for authentication waits.

  ## Adding A Timeout

  1. Choose an existing value from `constants/timeouts.js`.
  2. Use the named constant at the call site.
  3. Add a new named value only when the operation has a distinct timeout requirement.

  Example:

  ```js
  const { TIMEOUTS } = require("../constants/timeouts");

  await this.waitForElement(this.userMenu, TIMEOUTS.LONG);
````

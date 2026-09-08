# ShopQA Automation

A Playwright-based QA automation framework for the ShopQA e-commerce platform, organized around reusable page objects, tagged test tiers, feature coverage, regression checks, and end-to-end business journeys.

## 📋 Prerequisites

- Node.js 20+
- npm or yarn
- Git

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd ShopQA_Automation
npm install
npx playwright install --with-deps
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Run Tests

```bash
# Run all tests
npm test

# Run critical smoke tests
npm run test:smoke

# Run release-candidate sanity tests
npm run test:sanity

# Run regression and edge-case tests
npm run test:regression

# Run cross-page E2E journeys
npm run test:e2e

# Run admin panel tests only
npm run test:admin

# Run with headed browser
npm run test:headed

# Run specific browser
npm run test:chrome

# Debug mode
npm run test:debug

# Interactive UI mode
npm run test:ui

# View test report
npm run test:report
```

## 📁 Project Structure

```
ShopQA_Automation/
├── pageObjects/          # Page Object Model classes
│   ├── BasePage.js       # Base class with common methods
│   ├── LoginPage.js      # Login page object
│   ├── ProductsPage.js   # Product catalog page object
│   ├── RegistrationPage.js # Registration page object
│   └── POManager.js      # Page object manager
├── tests/                # Test specifications
│   ├── feature/          # Feature-level functional tests
│   ├── regression/       # Dedicated regression and edge-case tests
│   └── e2e/              # Cross-page business journeys
├── testData/             # Test data and configurations
│   ├── loginData.js      # Login credentials
│   └── env.config.js     # Environment configuration
├── utils/                # Utility functions
│   ├── logger.js         # Logging utility
│   └── assertions.js     # Custom assertions
├── constants/            # Constants and configuration
│   ├── routes.js          # Application routes
│   ├── selectors.js       # CSS selectors
│   └── timeouts.js        # Timeout values
├── docs/                 # Documentation
│   ├── ASSERTION_STRATEGY.md    # Assertion usage guide
│   └── CONSOLIDATION_SUMMARY.md # Refactoring summary
├── .github/workflows/    # CI/CD pipelines
├── playwright.config.js  # Playwright configuration
├── package.json          # Dependencies
└── .env.example         # Environment template
```

## 📚 Documentation

For detailed guidance on using the framework:

- **[Assertion Strategy Guide](./docs/ASSERTION_STRATEGY.md)** - When and how to use BasePage vs CustomAssertions
- **[Consolidation Summary](./docs/CONSOLIDATION_SUMMARY.md)** - Overview of assertion refactoring
- **[Timeout Usage Analysis](./docs/TIMEOUTS_USAGE_ANALYSIS.md)** - Centralized timeout guidance
- **[E2E Test Strategy](./docs/E2E_TEST_STRATEGY.md)** - Test folders, tags, and journey coverage

## 🏗️ Architecture

### Page Object Model (POM)

- **BasePage**: Abstract base class with common utilities
- **Domain page objects**: Login, Products, Cart, Checkout, Orders, Admin, and Accessibility flows
- **POManager**: Centralized page object instantiation

### Test Data Management

- Externalized test data in `testData/loginData.js`
- Environment-based configuration in `testData/env.config.js`
- Support for `.env` file for sensitive data

### Utilities

- **Logger**: Centralized logging to console and file
- **Assertions**: Two-tier assertion system (BasePage + CustomAssertions)

## 🧪 Test Categories

Tests are tagged with metadata for better organization:

- `@smoke`: Critical path tests (quick validation)
- `@sanity`: Focused happy-path checks for release candidates
- `@regression`: Negative, edge-case, and broader feature coverage
- `@e2e`: Cross-page business journeys under `tests/e2e/`
- `@admin`: Admin panel feature and admin E2E coverage
- `@login`: Login-related tests
- `@registration`: Registration-related tests

Smoke and sanity are tags rather than duplicate folders. This allows a feature test to belong to both tiers when appropriate.

## 📊 Reporting

Test reports are automatically generated in:

- **HTML Report**: `playwright-report/`
- **JSON Report**: `test-results/results.json`
- **JUnit Report**: `test-results/junit.xml`

View reports:

```bash
npm run test:report
```

## 🔄 CI/CD Integration

Tests run automatically on:

- Push to main/develop branches
- Pull requests
- Scheduled daily runs (2 AM UTC)

GitHub Actions workflow: `.github/workflows/playwright.yml`

## 🛠️ Development

### Run Linter

```bash
npm run lint
npm run lint:fix
```

### Format Code

```bash
npm run format
```

### Add New Tests

1. Place feature tests in `tests/feature/`, regression-only tests in `tests/regression/`, or cross-page journeys in `tests/e2e/`
2. Import POManager from a feature or regression test: `const { POManager } = require("../../pageObjects/POManager");`
3. Use page objects for interactions
4. Add test tags: `test("@smoke @login description", ...)`

### Add New Page Object

1. Create file in `pageObjects/` extending BasePage
2. Define selectors in constructor
3. Add interaction methods
4. Register in POManager

## 📝 Test Execution Examples

```javascript
// Basic test with page object
test("@smoke @login should login successfully", async ({ page }) => {
  const poManager = new POManager(page);
  const loginPage = poManager.getLoginPage();

  await loginPage.navigate();
  await loginPage.loginAs("user@test.com", "password");
  await loginPage.verifyCustomerLoggedIn();
});
```

## 🐛 Debugging

### Visual Debugging

```bash
# Run with headed browser (see what's happening)
npm run test:headed

# Debug a specific feature test file
npx playwright test tests/feature/Login.spec.js --debug
```

### View Traces

Traces are captured on first retry and saved in `test-results/`

### Screenshots & Videos

- Screenshots on failure: `test-results/`
- Videos on failure: `test-results/`

## 🔐 Security Best Practices

- Never commit `.env` file (add to `.gitignore`)
- Use environment variables for sensitive data
- Store credentials in GitHub Secrets for CI/CD (`USERNAME_CUSTOMER`, `PASSWORD_CUSTOMER`, `USERNAME_ADMIN`, `PASSWORD_ADMIN`)
- Rotate test credentials regularly

GitHub Actions requires these four repository secrets before authenticated tests can run:

1. Open the repository settings.
2. Select **Secrets and variables** > **Actions**.
3. Add `USERNAME_CUSTOMER`, `PASSWORD_CUSTOMER`, `USERNAME_ADMIN`, and `PASSWORD_ADMIN`.

The workflow validates these secrets before starting Playwright.

## 📚 Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [Debugging Guide](https://playwright.dev/docs/debug)

## 🤝 Contributing

1. Create a feature branch
2. Add tests for new features
3. Run `npm run lint:fix` and `npm run format`
4. Ensure all tests pass
5. Submit pull request

## 📄 License

ISC

## ✍️ Author

QA Automation Team

## 📞 Support

For issues or questions, please create an issue in the repository.

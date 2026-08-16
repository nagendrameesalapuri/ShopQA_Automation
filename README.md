# ShopQA Automation

A robust Playwright-based test automation framework for the ShopQA e-commerce platform with comprehensive login and authentication testing.

## 📋 Prerequisites

- Node.js 18+
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
│   └── POManager.js      # Page object manager
├── tests/                # Test specifications
│   └── Login.spec.js     # Login tests
├── testData/             # Test data and configurations
│   ├── loginData.js      # Login credentials
│   └── env.config.js     # Environment configuration
├── utils/                # Utility functions
│   ├── logger.js         # Logging utility
│   └── assertions.js     # Custom assertions
├── constants/            # Constants and configuration
│   └── selectors.js      # CSS selectors
├── fixtures/             # Test fixtures
│   └── auth.fixture.js   # Authentication fixtures
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

## 🏗️ Architecture

### Page Object Model (POM)

- **BasePage**: Abstract base class with common utilities
- **LoginPage**: Login page-specific methods extending BasePage
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
- `@regression`: Full regression test suite
- `@login`: Login-related tests

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

1. Create test file in `tests/` folder
2. Import POManager: `const { POManager } = require("../pageObjects/POManager");`
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

// Using authenticated fixture
test("@regression should logout successfully", async ({ authenticatedPage }) => {
  // Page is already authenticated
  await authenticatedPage.click("[data-testid='logout-btn']");
});
```

## 🐛 Debugging

### Visual Debugging

```bash
# Run with headed browser (see what's happening)
npm run test:headed

# Debug specific test file
npx playwright test tests/Login.spec.js --debug
```

### View Traces

Traces are captured on first retry and saved in `test-results/`

### Screenshots & Videos

- Screenshots on failure: `test-results/`
- Videos on failure: `test-results/`

## 🔐 Security Best Practices

- Never commit `.env` file (add to `.gitignore`)
- Use environment variables for sensitive data
- Store credentials in GitHub Secrets for CI/CD
- Rotate test credentials regularly

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

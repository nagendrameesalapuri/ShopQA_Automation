const { LoginPage } = require("../pageObjects/LoginPage");
const { RegistrationPage } = require("../pageObjects/RegistrationPage");
const { ProductsPage } = require("../pageObjects/ProductsPage");

class POManager {
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.registrationPage = new RegistrationPage(page);
    this.productsPage = new ProductsPage(page);
  }

  getLoginPage() {
    return this.loginPage;
  }

  getRegistrationPage() {
    return this.registrationPage;
  }

  getProductsPage() {
    return this.productsPage;
  }
}

module.exports = { POManager };

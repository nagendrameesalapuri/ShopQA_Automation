const { LoginPage } = require("../pageObjects/LoginPage");
const { RegistrationPage } = require("../pageObjects/RegistrationPage");
const { ProductsPage } = require("../pageObjects/ProductsPage");
const { CartPage } = require("./CartPage");
const { CheckoutPage } = require("./CheckoutPage");

class POManager {
  constructor(page) {
    this.page = page;
    this.loginPage = new LoginPage(page);
    this.registrationPage = new RegistrationPage(page);
    this.productsPage = new ProductsPage(page);
    this.cartPage = new CartPage(page);
    this.checkoutPage = new CheckoutPage(page);
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

  getCartPage() {
    return this.cartPage;
  }

  getCheckoutPage() {
    return this.checkoutPage;
  }
}

module.exports = { POManager };

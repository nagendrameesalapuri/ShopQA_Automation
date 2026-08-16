const { LoginPage } = require("../pageObjects/LoginPage");
const { RegistrationPage } = require("../pageObjects/RegistrationPage");

class POManager {
  constructor(page) {
    this.page = page;
    this.LoginPage = new LoginPage(page);
    this.RegistrationPage = new RegistrationPage(page);
  }

  getLoginPage() {
    return this.LoginPage;
  }

  getRegistrationPage() {
    return this.RegistrationPage;
  }
}

module.exports = { POManager };

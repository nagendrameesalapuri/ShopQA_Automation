const { LoginPage } = require("../pageObjects/LoginPage");

class POManager {
  constructor(page) {
    this.page = page;
    this.LoginPage = new LoginPage(page);
  }

  getLoginPage() {
    return this.LoginPage;
  }
}

module.exports = { POManager };

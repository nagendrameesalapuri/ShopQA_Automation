const { test } = require("@playwright/test");
const { POManager } = require("../pageObjects/POManager");

test.describe("Product Catalog", () => {
  let productsPage;

  test.beforeEach(async ({ page }) => {
    const poManager = new POManager(page);
    productsPage = poManager.getProductsPage();
    await productsPage.navigateToProductsPage();
  });

  test("@smoke should display product listing page", async () => {
    await productsPage.verifyProductsPageLoaded();
  });

  test("@smoke should verify page heading, product count and product cards", async () => {
    await productsPage.verifyPageHeading();
    await productsPage.verifyProductCount();
  });

  test("@smoke should verify default sorting", async () => {
    await productsPage.verifyDefaultSorting("newest");
  });

  test("@smoke should verify grid and list views", async () => {
    await productsPage.verifyGridAndListViews();
  });
});

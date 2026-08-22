const { test } = require("@playwright/test");
const { POManager } = require("../pageObjects/POManager");
const { APP_TEXT } = require("../constants/constants");
const { ROUTES } = require("../constants/routes");

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
    await productsPage.verifyDefaultSorting(APP_TEXT.DEFAULT_SORTING);
  });

  test("@smoke should verify grid and list views", async () => {
    await productsPage.verifyGridAndListViews();
  });

  test("@smoke should filter products by category", async ({ page }) => {
    await productsPage.selectCategory("books");
    await productsPage.verifyCategorySelected("books");
    await productsPage.verifyDisplayedProducts("books");
  });

  test("@smoke should sort products by price ascending", async ({ page }) => {
    await productsPage.sortProductsByValue(APP_TEXT.PRICE_ASC);
    await page.waitForURL(ROUTES.SORTING);
    await productsPage.verifyProductsSortedByPriceAscending();
  });

  test("@smoke should search for products", async ({ page }) => {
    await productsPage.searchProduct("iPhone");
    await productsPage.verifySearchURL("iPhone");
    await productsPage.verifySearchResults("iPhone");
  });

  test("@smoke should show no results for invalid search", async ({ page }) => {
    await productsPage.searchProduct("nagendra1234");
    await productsPage.verifySearchURL("nagendra1234");
    await productsPage.verifyNoSearchResults();
  });

  test("@smoke should paginate products", async ({ page }) => {
    await productsPage.sortProductsByValue(APP_TEXT.A_TO_Z);
    const beforeFirst = await productsPage.getFirstProductName();
    await productsPage.goToNextPage();
    await productsPage.verifyPageNumber(2);
    await productsPage.verifyDifferentProduct(beforeFirst);
  });

  test("@smoke should enable infinite scroll", async ({ page }) => {
    await productsPage.verifyInfiniteScroll();
  });

  test("@smoke should show out-of-stock badge", async ({ page }) => {
    await productsPage.verifyOutOfStockBadge();
  });

  test("@smoke should display full product details", async ({ page }) => {
    await productsPage.verifyProductDetails();
  });
});

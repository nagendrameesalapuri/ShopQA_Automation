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
    logger.testStart("should display product listing page");
    await productsPage.verifyProductsPageLoaded();
    logger.testPass("should display product listing page");
  });

  test("@smoke should verify page heading, product count and product cards", async () => {
    logger.testStart("should verify page heading, product count and product cards");
    await productsPage.verifyPageHeading();
    await productsPage.verifyProductCount();
    logger.testPass("should verify page heading, product count and product cards");
  });

  test("@smoke should verify default sorting", async () => {
    logger.testStart("should verify default sorting");
    await productsPage.verifyDefaultSorting(APP_TEXT.DEFAULT_SORTING);
    logger.testPass("should verify default sorting");
  });

  test("@smoke should verify grid and list views", async () => {
    logger.testStart("should verify grid and list views");
    await productsPage.verifyGridAndListViews();
    logger.testPass("should verify grid and list views");
  });

  test("@smoke should filter products by category", async ({ page }) => {
    logger.testStart("should filter products by category");
    await productsPage.selectCategory("books");
    await productsPage.verifyCategorySelected("books");
    await productsPage.verifyDisplayedProducts("books");
    logger.testPass("should filter products by category");
  });

  test("@smoke should sort products by price ascending", async ({ page }) => {
    logger.testStart("should sort products by price ascending");
    await productsPage.sortProductsByValue(APP_TEXT.PRICE_ASC);
    await page.waitForURL(ROUTES.SORTING);
    await productsPage.verifyProductsSortedByPriceAscending();
    logger.testPass("should sort products by price ascending");
  });

  test("@smoke should search for products", async ({ page }) => {
    logger.testStart("should search for products");
    await productsPage.searchProduct("iPhone");
    await productsPage.verifySearchURL("iPhone");
    await productsPage.verifySearchResults("iPhone");
    logger.testPass("should search for products");
  });

  test("@smoke should show no results for invalid search", async ({ page }) => {
    logger.testStart("should show no results for invalid search");
    await productsPage.searchProduct("nagendra1234");
    await productsPage.verifySearchURL("nagendra1234");
    await productsPage.verifyNoSearchResults();
    logger.testPass("should show no results for invalid search");
  });

  test("@smoke should paginate products", async ({ page }) => {
    logger.testStart("should paginate products");
    await productsPage.sortProductsByValue(APP_TEXT.A_TO_Z);
    const beforeFirst = await productsPage.getFirstProductName();
    await productsPage.goToNextPage();
    await productsPage.verifyPageNumber(2);
    await productsPage.verifyDifferentProduct(beforeFirst);
    logger.testPass("should paginate products");
  });

  test("@smoke should enable infinite scroll", async ({ page }) => {
    logger.testStart("should enable infinite scroll");
    await productsPage.verifyInfiniteScroll();
    logger.testPass("should enable infinite scroll");
  });

  test("@smoke should show out-of-stock badge", async ({ page }) => {
    logger.testStart("should show out-of-stock badge");
    await productsPage.verifyOutOfStockBadge();
    logger.testPass("should show out-of-stock badge");
  });

  test("@smoke should display full product details", async ({ page }) => {
    logger.testStart("should display full product details");
    await productsPage.verifyProductDetails();
    logger.testPass("should display full product details");
  });
});

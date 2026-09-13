const { test } = require("@playwright/test");
const { POManager } = require("../../pageObjects/POManager");
const { APP_TEXT } = require("../../constants/constants");
const { ROUTES } = require("../../constants/routes");
const logger = require("../../utils/logger");

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

  test("@smoke @sanity should verify page heading, product count and product cards", async () => {
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

  test("@regression should verify grid and list views", async () => {
    logger.testStart("should verify grid and list views");
    await productsPage.verifyGridAndListViews();
    logger.testPass("should verify grid and list views");
  });

  test("@regression should filter products by category", async () => {
    logger.testStart("should filter products by category");
    await productsPage.selectCategory("books");
    await productsPage.verifyCategorySelected("books");
    await productsPage.verifyDisplayedProducts("books");
    logger.testPass("should filter products by category");
  });

  test("@regression should sort products by price ascending", async ({ page }) => {
    logger.testStart("should sort products by price ascending");
    await productsPage.sortProductsByValue(APP_TEXT.PRICE_ASC);
    await page.waitForURL(ROUTES.SORTING);
    await productsPage.verifyProductsSortedByPriceAscending();
    logger.testPass("should sort products by price ascending");
  });

  test("@smoke should search for products", async () => {
    logger.testStart("should search for products");
    await productsPage.searchProduct("iPhone");
    await productsPage.verifySearchURL("iPhone");
    await productsPage.verifySearchResults("iPhone");
    logger.testPass("should search for products");
  });

  test("@regression should show no results for invalid search", async () => {
    logger.testStart("should show no results for invalid search");
    await productsPage.searchProduct("nagendra1234");
    await productsPage.verifySearchURL("nagendra1234");
    await productsPage.verifyNoSearchResults();
    logger.testPass("should show no results for invalid search");
  });

  test("@regression should paginate products", async () => {
    logger.testStart("should paginate products");
    await productsPage.sortProductsByValue(APP_TEXT.A_TO_Z);
    const beforeFirst = await productsPage.getFirstProductName();
    await productsPage.goToNextPage();
    await productsPage.verifyPageNumber(2);
    await productsPage.verifyDifferentProduct(beforeFirst);
    logger.testPass("should paginate products");
  });

  test("@regression should enable infinite scroll", async () => {
    logger.testStart("should enable infinite scroll");
    await productsPage.verifyInfiniteScroll();
    logger.testPass("should enable infinite scroll");
  });

  test("@regression should show out-of-stock badge", async () => {
    logger.testStart("should show out-of-stock badge");
    const hasOutOfStock = await productsPage.hasOutOfStockProducts();
    test.skip(!hasOutOfStock, "No out-of-stock products currently exist in the catalog");
    await productsPage.verifyOutOfStockBadge();
    logger.testPass("should show out-of-stock badge");
  });

  test("@regression should display full product details", async () => {
    logger.testStart("should display full product details");
    await productsPage.verifyProductDetails();
    logger.testPass("should display full product details");
  });
});

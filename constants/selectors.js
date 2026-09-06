const { APP_TEXT } = require("./constants");

const SELECTORS = {
  // Login Form
  LOGIN_FORM: "[data-testid='login-form']",
  EMAIL_INPUT: "[data-testid='input-email']",
  PASSWORD_INPUT: "[data-testid='input-password']",
  SIGN_IN_BUTTON: `button:has-text('${APP_TEXT.SIGN_IN_LABEL}')`,
  REMEMBER_ME_CHECKBOX: "input[type='checkbox']",
  TOGGLE_PASSWORD: "[data-testid='toggle-password']",
  FORGOT_PASSWORD_LINK: "a:has-text('Forgot Password?')",

  // Error Messages
  EMAIL_ERROR: "[data-testid='email-error']",
  PASSWORD_ERROR: "[data-testid='password-error']",
  LOGIN_ERROR: "[data-testid='login-error']",

  // User Menu & Dashboard
  USER_MENU: "[data-testid='user-menu-btn']",
  ADMIN_DASHBOARD: "[data-testid='admin-dashboard']",
  SESSION_EXPIRED_MSG: "[data-testid='session-expired-msg']",

  // Registration Form
  REQUIRED_ERROR: ".form-error",
  REGISTRATION_FORM: "[data-testid='register-form']",
  REGISTRATION_FIRST_NAME_INPUT: "[data-testid='input-reg-first-name']",
  REGISTRATION_LAST_NAME_INPUT: "[data-testid='input-reg-last-name']",
  REGISTRATION_EMAIL_INPUT: "[data-testid='input-reg-email']",
  REGISTRATION_PASSWORD_INPUT: "[data-testid='input-reg-password']",
  REGISTRATION_CONFIRM_PASSWORD_INPUT: "[data-testid='input-reg-confirm-password']",
  REGISTRATION_PHONE_INPUT: "[data-testid='input-reg-phone']",
  CREATE_ACCOUNT_BUTTON: `button:has-text('${APP_TEXT.CREATE_ACCOUNT_BUTTON}')`,
  SIGN_IN_LINK: "a:has-text('Sign in')",
  PASSWORD_STRENGTH: "[data-testid='password-strength']",
  CONFIRM_PASSWORD_ERROR: "[data-testid='confirm-password-error']",
  REGISTRATION_SUCCESS_MESSAGE: `text=${APP_TEXT.REGISTRATION_SUCCESS_MESSAGE}`,

  // Product Catalog
  PRODUCT_GRID: "[data-testid='product-grid']",
  LIST_VIEW_BUTTON: "[data-testid='view-list']",
  GRID_VIEW_BUTTON: "[data-testid='view-grid']",
  PRODUCT_CARD: "[data-testid='product-card']",
  PRODUCT_COUNT: "[data-testid='product-count']",
  PRODUCTS_HEADING: `h1:has-text('${APP_TEXT.PRODUCT_HEADING}')`,
  SORT_DROPDOWN: "select",
  PRODUCT_CATEGORY_FILTER: (category) => `[data-testid='filter-cat-${category}']`,
  PRODUCT_CATEGORY: "[data-testid='product-category']",
  SORT_DROPDOWN: "[data-testid='sort-select']",
  PRODUCT_PRICE: "[data-testid='product-price']",
  PRODUCT_SEARCH_INPUT: "[data-testid='nav-search-input']",
  PRODUCT_SEARCH_BUTTON: "[data-testid='nav-search-btn']",
  EMPTY_STATE: '[data-testid="empty-state"]',
  NEXT_PAGE: '[data-testid="next-page"]',
  PRODUCT_NAME: '[data-testid="product-name"]',
  INFINITE_SCROLL_TOGGLE: '[data-testid="infinite-scroll-toggle"]',
  OUT_OF_STOCK_BADGE: '[data-testid="out-of-stock-badge"]',
  PRODUCT_DETAIL_NAME: '[data-testid="product-detail-name"]',
  PRODUCT_DETAIL_PRICE: '[data-testid="product-detail-price"]',
  PRODUCT_DETAIL_STOCK: '[data-testid="product-detail-stock"]',
  PRODUCT_DETAIL_RATING: '[data-testid="star-rating"]',

  //CART
  ADD_TO_CART_BUTTON: '[data-testid="add-to-cart-btn"]',
  CART_COUNT: '[data-testid="cart-count"]',
  ALERT: "alert",
  TOAST: ".Toastify__toast",
  CART_QUANTITY: "[data-testid='cart-qty']",
  CART_QUANTITY_INCREASE: "[data-testid='qty-increase']",
  CART_QUANTITY_DECREASE: "[data-testid='qty-decrease']",
  REMOVE_ITEM_BUTTON: '[data-testid="remove-item-btn"]',
  COUPON_INPUT: '[data-testid="coupon-input"]',
  APPLY_COUPON_BUTTON: '[data-testid="apply-coupon-btn"]',
  COUPON_SUCCESS: '[data-testid="coupon-success"]',
  DISCOUNT_AMOUNT: '[data-testid="discount-amount"]',
  COUPON_ERROR: '[data-testid="coupon-error"]',
  CART_SUBTOTAL: '[data-testid="cart-subtotal"]',
  CART_TOTAL: '[data-testid="cart-total"]',

  //CHECK OUT
  CHECK_OUT_STEP: "[data-testid='step-indicator'] [data-testid^='step-']",
  CHECK_OUT_NEXT_STEP: '[data-testid="btn-next"]',
  CHECK_OUT_FULL_NAME: '[data-testid="field-full-name"]',
  CHECK_OUT_PHONE: '[data-testid="field-phone"]',
  CHECK_OUT_ADDRESS_LINE1: '[data-testid="field-line1"]',
  CHECK_OUT_CITY: '[data-testid="field-city"]',
  CHECK_OUT_STATE: '[data-testid="field-state"]',
  CHECK_OUT_POSTAL_CODE: '[data-testid="field-postal"]',

  //DASHBOARD
  SEARCH_INPUT: "[data-testid='nav-search-input']",
  SEARCH_BUTTON: "[data-testid='nav-search-btn']",
};

module.exports = { SELECTORS };

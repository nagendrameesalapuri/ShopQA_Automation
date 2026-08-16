const SELECTORS = {
  // Login Form
  LOGIN_FORM: "[data-testid='login-form']",
  EMAIL_INPUT: "[data-testid='input-email']",
  PASSWORD_INPUT: "[data-testid='input-password']",
  SIGN_IN_BUTTON: "button:has-text('Sign In')",
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
};

module.exports = { SELECTORS };

require("dotenv").config();

const requiredCiCredentials = [
  "USERNAME_CUSTOMER",
  "PASSWORD_CUSTOMER",
  "USERNAME_ADMIN",
  "PASSWORD_ADMIN",
];

if (process.env.CI) {
  const missingCredentials = requiredCiCredentials.filter((name) => !process.env[name]);
  if (missingCredentials.length > 0) {
    throw new Error(`Missing required CI credentials: ${missingCredentials.join(", ")}`);
  }
}

const loginData = {
  customer: {
    email: process.env.USERNAME_CUSTOMER || "john@test.com",
    password: process.env.PASSWORD_CUSTOMER || "Password123!",
  },

  invalidUser: {
    email: "wrong@email.com",
    password: "WrongPassword1",
  },

  invalidEmail: {
    email: "notanemail",
    password: "password",
  },

  admin: {
    email: process.env.USERNAME_ADMIN || "admin@shopqa.com",
    password: process.env.PASSWORD_ADMIN || "Password123!",
  },
};

module.exports = { loginData };

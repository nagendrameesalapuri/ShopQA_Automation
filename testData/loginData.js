require("dotenv").config();

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

const registerData = {
  validUser: {
    firstName: "Nagendra",
    lastName: "Meesala",
    email: `john${Date.now()}@test.com`,
    password: "Password123!",
    confirmPassword: "Password123!",
    phone: "9876543210",
  },

  invalidEmail: {
    firstName: "Nagendra",
    lastName: "Meesala",
    email: "invalidemail",
    password: "Password123!",
    confirmPassword: "Password123!",
    phone: "9876543210",
  },

  passwordMismatch: {
    firstName: "Nagendra",
    lastName: "Meesala",
    email: `mismatch${Date.now()}@test.com`,
    password: "Password123!",
    confirmPassword: "Different123!",
    phone: "9876543210",
  },

  shortPassword: {
    firstName: "Nagendra",
    lastName: "Meesala",
    email: `short${Date.now()}@test.com`,
    password: "123",
    confirmPassword: "123",
    phone: "9876543210",
  },
};

module.exports = { registerData };

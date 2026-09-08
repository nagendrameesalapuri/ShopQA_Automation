const CheckoutData = {
  testDate: {
    monthOffset: 1,
    day: 10,
  },
  valid: {
    fullName: "John Doe",
    phone: "9876543210",
    line1: "123 Test Street",
    city: "Bengaluru",
    state: "Karnataka",
    postal: "560001",
    cardNumber: "4111111111111111",
    cardExpiry: "12/25",
    cardCvv: "123",
    cardName: "JOHN DOE",
  },
  invalid: {
    fullName: "John Doe",
    phone: "9876543210",
    address: "123 Test Street",
    city: "Bengaluru",
    state: "Karnataka",
    postalCode: "12",
  },
};

module.exports = { CheckoutData };

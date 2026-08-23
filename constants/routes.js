const ROUTES = {
  LOGIN: "/login",
  EXPIRED_SESSION: "/login?expired=true",
  REGISTRATION: "/register",
  PRODUCTS: "/products",
  CART: "/cart",
  OUT_OF_STOCK: "/products?inStock=false",
  SORTING: "**/products?**sort=price_asc**",
};

module.exports = { ROUTES };

const ROUTES = {
  LOGIN: "/login",
  EXPIRED_SESSION: "/login?expired=true",
  REGISTRATION: "/register",
  PRODUCTS: "/products",
  CART: "/cart",
  ORDERS: "/orders",
  ADMIN: "/admin",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_COUPONS: "/admin/coupons",
  OUT_OF_STOCK: "/products?inStock=false",
  SORTING: "**/products?**sort=price_asc**",
};

module.exports = { ROUTES };

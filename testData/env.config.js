require("dotenv").config();

const config = {
  dev: {
    baseURL: "https://nagendra-shopqa.netlify.app",
    apiURL: "https://api.shopqa.dev",
    environment: "development",
  },
  uat: {
    baseURL: "https://uat-shopqa.netlify.app",
    apiURL: "https://api-uat.shopqa.com",
    environment: "staging",
  },
  prod: {
    baseURL: "https://shopqa.com",
    apiURL: "https://api.shopqa.com",
    environment: "production",
  },
};

const environment = process.env.ENV || "dev";

module.exports = {
  env: environment,
  config: config[environment],
  getBaseURL: () => process.env.BASE_URL || config[environment].baseURL,
  getAPIURL: () => process.env.API_URL || config[environment].apiURL,
};

const shopify = require("../../services/shopifyProductService");
const stateRepo = require("../../state/stateRepository");

module.exports = async (user, text, state) => {

  const products = await shopify.getProducts(state);

  state.products = products;
  state.step = "display";
  stateRepo.set(user, state);

  const next = require("./productDisplay");
  return next(user, "", state);
};

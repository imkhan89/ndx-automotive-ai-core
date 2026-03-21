const shopify = require("../../services/shopifyService");
const stateRepo = require("../../state/stateRepository");

const rank = require("../../decisions/productRankingDecision");
const fallback = require("../../decisions/fallbackDecision");

const send = require("../../services/whatsappService").send;

module.exports = async (user, text, state) => {

  let products = await shopify.getProducts(state);

  products = rank(products);

  const check = fallback(products);

  if (check.type === "no_results") {
    return send(
      user,
      "No products found. Type 'menu' to restart or 'support' for help."
    );
  }

  state.products = products;
  state.step = "display";
  stateRepo.set(user, state);

  const next = require("./productDisplay");
  return next(user, "", state);
};

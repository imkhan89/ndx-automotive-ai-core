const shopify = require("../../services/shopifyProductService");
const stateRepo = require("../../state/stateRepository");

const rankingDecision = require("../../decisions/productRankingDecision");
const fallbackDecision = require("../../decisions/fallbackDecision");

module.exports = async (user, text, state) => {

  let products = await shopify.getProducts(state);

  // 🧠 APPLY DECISION: ranking
  products = rankingDecision(products, state);

  // 🧠 APPLY DECISION: fallback
  const fallback = fallbackDecision(products);

  if (fallback.type === "no_results") {
    return require("../../services/whatsappService").send(user, fallback.message);
  }

  state.products = products;
  state.step = "display";

  stateRepo.set(user, state);

  const next = require("./productDisplay");
  return next(user, "", state);
};

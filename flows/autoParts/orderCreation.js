const shopify = require("../../services/shopifyService");
const stateRepo = require("../../state/stateRepository");

module.exports = async (user, text, state) => {

  await shopify.createOrder(state);

  state.step = "success";
  stateRepo.set(user, state);

  const next = require("./orderSuccess");
  return next(user, "", state);
};

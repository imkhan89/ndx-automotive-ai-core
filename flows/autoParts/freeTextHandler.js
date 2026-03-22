const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

module.exports = (user, text, state) => {

  // Basic validation
  if (!text || text.trim().length < 3) {
    return send(user, "Please enter valid product details.");
  }

  // Store raw query
  state.query = text;

  // Move to fetch step
  state.step = "fetch";
  stateRepo.set(user, state);

  const next = require("./productFetch");
  return next(user, "", state);
};

const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

const inputTemplate = require("../../interface/templates/inputTemplate");

module.exports = (user, text, state) => {

  // Save selected category (default if empty)
  state.productType = text || "Air Filter";

  // Move to next step
  state.step = "make";
  stateRepo.set(user, state);

  return send(user, inputTemplate.make());
};

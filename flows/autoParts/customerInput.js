const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

const inputTemplate = require("../../interface/templates/inputTemplate");

module.exports = (user, text, state) => {

  // First input → Name
  if (!state.customer) {
    state.customer = {};
    state.customer.name = text;

    stateRepo.set(user, state);

    return send(user, inputTemplate.address());
  }

  // Second input → Address
  state.customer.address = text;

  state.step = "create";
  stateRepo.set(user, state);

  const next = require("./orderCreation");
  return next(user, "", state);
};

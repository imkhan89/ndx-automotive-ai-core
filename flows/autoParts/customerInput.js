const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

module.exports = (user, text, state) => {

  if (!state.customer) {
    state.customer = {};
    state.customer.name = text;
    stateRepo.set(user, state);

    return send(user, "Enter Address:");
  }

  state.customer.address = text;
  state.step = "create";
  stateRepo.set(user, state);

  const next = require("./orderCreation");
  return next(user, "", state);
};

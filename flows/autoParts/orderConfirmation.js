const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

const inputTemplate = require("../../interface/templates/inputTemplate");
const errorTemplate = require("../../interface/templates/errorTemplate");

module.exports = (user, text, state) => {

  if (text.toLowerCase() !== "yes") {
    return send(user, errorTemplate.cancelled());
  }

  // Move to customer step
  state.step = "customer";
  stateRepo.set(user, state);

  return send(user, inputTemplate.name());
};

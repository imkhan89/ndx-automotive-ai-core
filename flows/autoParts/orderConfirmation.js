const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

const input = require("../../interface/templates/inputTemplate");
const error = require("../../interface/templates/errorTemplate");

module.exports = (user, text, state) => {

  if (!text || text.toLowerCase() !== "yes") {
    return send(user, error.cancelled());
  }

  state.step = "customer";
  stateRepo.set(user, state);

  return send(user, input.name());
};

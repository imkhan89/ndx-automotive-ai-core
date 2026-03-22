const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");
const input = require("../../interface/templates/inputTemplate");

module.exports = (user, text, state) => {

  state.make = text;
  state.step = "model";
  stateRepo.set(user, state);

  return send(user, input.model());
};

const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");
const input = require("../../interface/templates/inputTemplate");

module.exports = (user, text, state) => {

  state.model = text;
  state.step = "year";
  stateRepo.set(user, state);

  return send(user, input.year());
};

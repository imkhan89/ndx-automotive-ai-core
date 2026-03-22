const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");
const inputTemplate = require("../../interface/templates/inputTemplate");

module.exports = (user, text, state) => {

  // Store Model
  state.model = text;

  // Move to next step
  state.step = "year";
  stateRepo.set(user, state);

  return send(user, inputTemplate.year());
};

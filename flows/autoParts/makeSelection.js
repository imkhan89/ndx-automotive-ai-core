const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");
const inputTemplate = require("../../interface/templates/inputTemplate");

module.exports = (user, text, state) => {

  // Store Make
  state.make = text;

  // Move to next step
  state.step = "model";
  stateRepo.set(user, state);

  // UI handled via template
  return send(user, inputTemplate.model());
};

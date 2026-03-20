const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

module.exports = (user, text, state) => {

  state.model = text;
  state.step = "year";
  stateRepo.set(user, state);

  return send(user, "Enter Year:");
};

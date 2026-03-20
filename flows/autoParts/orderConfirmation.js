const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

module.exports = (user, text, state) => {

  if (text.toLowerCase() !== "yes") {
    return send(user, "Order cancelled.");
  }

  state.step = "customer";
  stateRepo.set(user, state);

  return send(user, "Enter Your Name:");
};

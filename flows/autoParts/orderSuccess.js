const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

module.exports = (user, text, state) => {

  stateRepo.set(user, { flow: "main" });

  return send(user, "Order placed successfully ✅");
};

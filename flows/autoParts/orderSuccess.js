const send = require("../../services/whatsappService").send;
const stateRepo = require("../../state/stateRepository");

const successTemplate = require("../../interface/templates/successTemplate");

module.exports = (user, text, state) => {

  stateRepo.set(user, { flow: "main" });

  return send(user, successTemplate());
};

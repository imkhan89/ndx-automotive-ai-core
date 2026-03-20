const stateRepo = require("../state/stateRepository");
const send = require("../services/whatsappService").send;
const mainMenu = require("../interface/templates/mainMenuTemplate");

module.exports = async (user) => {
  stateRepo.set(user, { flow: "main" });

  return send(user, mainMenu());
};

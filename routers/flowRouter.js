const stateRepo = require("../state/stateRepository");
const autoPartsEntry = require("../flows/autoParts/entry");
const send = require("../services/whatsappService").send;
const mainMenu = require("../interface/templates/mainMenuTemplate");

exports.route = async (user, text) => {
  let state = stateRepo.get(user);

  if (!state) {
    stateRepo.set(user, { flow: "main" });
    return send(user, mainMenu());
  }

  if (state.flow === "autoParts") {
    return autoPartsEntry(user, text, state);
  }

  if (text === "1") {
    state.flow = "autoParts";
    state.step = "category";
    stateRepo.set(user, state);

    return autoPartsEntry(user, "", state);
  }

  return send(user, mainMenu());
};
